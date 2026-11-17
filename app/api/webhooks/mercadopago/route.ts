import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseServer } from "@/lib/supabase/server";
import { enviarEmailPedidoPagado } from "@/lib/email/pedido";

export const runtime = "nodejs";

type NotificacionMercadoPago = {
  id?: string | number;
  type?: string;
  action?: string;
  live_mode?: boolean;
  data?: { id?: string | number };
};

type PagoMercadoPago = {
  id?: string | number;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number | string;
  currency_id?: string;
  payment_type_id?: string;
};

function parseSignature(value: string | null) {
  if (!value) return null;
  let ts = "";
  let v1 = "";
  for (const part of value.split(",")) {
    const [key, ...rest] = part.split("=");
    const val = rest.join("=").trim();
    if (key?.trim() === "ts") ts = val;
    if (key?.trim() === "v1") v1 = val;
  }
  return ts && v1 ? { ts, v1 } : null;
}

function firmaValida({
  xSignature, xRequestId, dataId, secret,
}: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
}) {
  const parsed = parseSignature(xSignature);
  if (!parsed) return false;

  // Mercado Pago indica que cada par del manifest se agrega solo cuando
  // el dato correspondiente está presente. x-request-id puede faltar en
  // algunas notificaciones/simulaciones; no debemos rechazarlo por eso.
  const manifestParts: string[] = [];
  if (dataId) manifestParts.push(`id:${dataId.toLowerCase()};`);
  if (xRequestId) manifestParts.push(`request-id:${xRequestId};`);
  manifestParts.push(`ts:${parsed.ts};`);
  const manifest = manifestParts.join("");

  const expected = createHmac("sha256", secret.trim()).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(parsed.v1, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function obtenerPago(paymentId: string): Promise<PagoMercadoPago> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Pago no pudo consultar el pago: ${detail}`);
  }
  return (await response.json()) as PagoMercadoPago;
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Falta MERCADOPAGO_WEBHOOK_SECRET.");
      return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 });
    }

    const url = new URL(request.url);
    const queryDataId = url.searchParams.get("data.id");
    const queryType = url.searchParams.get("type");
    const body = (await request.json().catch(() => ({}))) as NotificacionMercadoPago;
    const dataId = queryDataId || (body.data?.id != null ? String(body.data.id) : null);
    const type = body.type || queryType || (body.action?.startsWith("payment.") ? "payment" : null);

    // Checkout Pro (Preferences API) notifica los pagos con type="payment".
    if (type && type !== "payment") return NextResponse.json({ received: true });
    if (!dataId) return NextResponse.json({ received: true });

    const requestId = request.headers.get("x-request-id");
    const signature = request.headers.get("x-signature");
    const firmaOk = firmaValida({
      xSignature: signature,
      xRequestId: requestId,
      dataId,
      secret: webhookSecret,
    });

    // El simulador oficial de Mercado Pago envía live_mode=false y un Data ID
    // ficticio (123456). Se confirma su recepción sin consultar un pago ni
    // alterar pedidos. Las compras sandbox reales también llevan live_mode=false,
    // pero deben tener firma válida para continuar y actualizar Supabase.
    if (body.live_mode === false && dataId === "123456" && !firmaOk) {
      return NextResponse.json({ received: true, simulation: true });
    }

    // Para pagos reales y compras sandbox exigimos siempre la firma HMAC.
    if (!firmaOk) {
      console.warn("Webhook Mercado Pago rechazado: firma inválida o encabezados incompletos.", {
        liveMode: body.live_mode,
        hasSignature: Boolean(signature),
        hasRequestId: Boolean(requestId),
        hasDataId: Boolean(dataId),
        hasSecret: Boolean(webhookSecret.trim()),
        dataIdFromQuery: Boolean(queryDataId),
      });
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }

    const pago = await obtenerPago(dataId);
    const numeroPedido = pago.external_reference?.trim();
    if (!numeroPedido) return NextResponse.json({ received: true });

    const supabase = getSupabaseServer();
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos").select("*").eq("numero_pedido", numeroPedido).maybeSingle();
    if (pedidoError) throw pedidoError;
    if (!pedido) return NextResponse.json({ received: true });

    const montoPago = Number(pago.transaction_amount);
    const montoPedido = Number(pedido.total);
    if (!Number.isFinite(montoPago) || montoPago !== montoPedido || (pago.currency_id && pago.currency_id !== "CLP")) {
      console.error("Monto/moneda del pago no coincide con el pedido", { numeroPedido, montoPago, montoPedido, currency: pago.currency_id });
      await supabase.from("pedidos").update({
        mercadopago_payment_id: String(pago.id || dataId),
        mercadopago_status: pago.status || null,
        mercadopago_status_detail: pago.status_detail || null,
        updated_at: new Date().toISOString(),
      }).eq("id", pedido.id);
      return NextResponse.json({ received: true });
    }

    const estaAprobado = pago.status === "approved";
    const yaEstaPagado = pedido.estado === "pagado" || Boolean(pedido.pagado_at);
    const ahora = new Date().toISOString();
    const { error: updateError } = await supabase.from("pedidos").update({
      mercadopago_payment_id: String(pago.id || dataId),
      // Una notificación tardía no debe hacer retroceder un pedido pagado.
      mercadopago_status: yaEstaPagado ? "approved" : (pago.status || null),
      mercadopago_status_detail: yaEstaPagado ? (pedido.mercadopago_status_detail || "accredited") : (pago.status_detail || null),
      estado: (estaAprobado || yaEstaPagado) ? "pagado" : pedido.estado,
      pagado_at: (estaAprobado || yaEstaPagado) ? pedido.pagado_at || ahora : pedido.pagado_at,
      updated_at: ahora,
    }).eq("id", pedido.id);
    if (updateError) throw updateError;
    if (!estaAprobado && !yaEstaPagado) return NextResponse.json({ received: true });

    const { data: pedidoActualizado, error: fetchError } = await supabase
      .from("pedidos").select("*").eq("id", pedido.id).single();
    if (fetchError || !pedidoActualizado) throw fetchError || new Error("No se pudo recuperar el pedido actualizado.");

    if (!pedidoActualizado.email_enviado_at) {
      await enviarEmailPedidoPagado({
        numero_pedido: pedidoActualizado.numero_pedido,
        fecha: new Date(pedidoActualizado.created_at).toLocaleString("es-CL"),
        cliente: {
          nombre: pedidoActualizado.cliente_nombre,
          apellido: pedidoActualizado.cliente_apellido,
          rut: pedidoActualizado.cliente_rut,
          email: pedidoActualizado.cliente_email,
          telefono: pedidoActualizado.cliente_telefono,
          direccion: pedidoActualizado.direccion,
          numero: pedidoActualizado.numero_direccion,
          depto: pedidoActualizado.depto || "",
          comuna: pedidoActualizado.comuna,
          region: pedidoActualizado.region,
        },
        items: pedidoActualizado.items,
        subtotal: Number(pedidoActualizado.subtotal),
        costo_envio: Number(pedidoActualizado.costo_envio),
        total: Number(pedidoActualizado.total),
      }, {
        id: String(pago.id || dataId),
        status: pago.status || "approved",
        status_detail: pago.status_detail,
      });

      const { error: emailUpdateError } = await supabase.from("pedidos").update({
        email_enviado_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", pedido.id).is("email_enviado_at", null);
      if (emailUpdateError) throw emailUpdateError;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Mercado Pago:", error);
    return NextResponse.json({ error: "Error procesando webhook." }, { status: 500 });
  }
}
