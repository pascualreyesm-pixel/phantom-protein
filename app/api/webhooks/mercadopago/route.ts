import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseServer } from "@/lib/supabase/server";
import { enviarEmailPedidoPagado } from "@/lib/email/pedido";

export const runtime = "nodejs";

type NotificacionMercadoPago = {
  id?: string | number;
  type?: string;
  action?: string;
  data?: { id?: string | number };
};

type OrderPayment = {
  id?: string | number;
  status?: string;
  status_detail?: string;
  paid_amount?: string | number;
};

type OrderMercadoPago = {
  id: string;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  total_amount?: string | number;
  total_paid_amount?: string | number;
  transactions?: {
    payments?: OrderPayment[];
  };
};

function parseSignature(value: string | null) {
  if (!value) return null;
  const parts = value.split(",");
  let ts = "";
  let v1 = "";

  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    const val = rest.join("=").trim();
    if (key?.trim() === "ts") ts = val;
    if (key?.trim() === "v1") v1 = val;
  }

  return ts && v1 ? { ts, v1 } : null;
}

function firmaValida({
  xSignature,
  xRequestId,
  dataId,
  secret,
}: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
}) {
  const parsed = parseSignature(xSignature);
  if (!parsed || !xRequestId || !dataId) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${parsed.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(parsed.v1, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function obtenerOrder(orderId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en .env.local.");

  const response = await fetch(
    `https://api.mercadopago.com/v1/orders/${encodeURIComponent(orderId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Pago no pudo consultar la order: ${detail}`);
  }

  return (await response.json()) as OrderMercadoPago;
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 });
    }

    const url = new URL(request.url);
    const queryDataId = url.searchParams.get("data.id");
    const queryType = url.searchParams.get("type");
    const body = (await request.json().catch(() => ({}))) as NotificacionMercadoPago;

    const dataId = queryDataId || (body.data?.id != null ? String(body.data.id) : null);
    const type = body.type || queryType;

    if (type && type !== "order") {
      return NextResponse.json({ received: true });
    }

    const requestId = request.headers.get("x-request-id");
    const signature = request.headers.get("x-signature");

    if (!firmaValida({ xSignature: signature, xRequestId: requestId, dataId, secret: webhookSecret })) {
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }

    if (!dataId) {
      return NextResponse.json({ received: true });
    }

    const order = await obtenerOrder(String(dataId));
    const numeroPedido = order.external_reference?.trim();

    if (!numeroPedido) {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseServer();
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("numero_pedido", numeroPedido)
      .maybeSingle();

    if (pedidoError) throw pedidoError;
    if (!pedido) return NextResponse.json({ received: true });

    const orderTotal = Number(order.total_amount);
    const orderPaid = Number(order.total_paid_amount);
    const pedidoTotal = Number(pedido.total);

    if (!Number.isFinite(orderTotal) || orderTotal !== pedidoTotal) {
      console.error("Monto de order no coincide", { numeroPedido, orderTotal, pedidoTotal });
      await supabase
        .from("pedidos")
        .update({
          mercadopago_order_id: String(order.id),
          mercadopago_status: order.status || null,
          mercadopago_status_detail: order.status_detail || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pedido.id);
      return NextResponse.json({ received: true });
    }

    const pago = order.transactions?.payments?.[0];
    const pagoId = pago?.id != null ? String(pago.id) : String(order.id);
    const estaAprobado =
      order.status === "processed" && order.status_detail === "accredited" &&
      Number.isFinite(orderPaid) && orderPaid === pedidoTotal;

    const ahora = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("pedidos")
      .update({
        mercadopago_order_id: String(order.id),
        mercadopago_payment_id: pagoId,
        mercadopago_status: order.status || null,
        mercadopago_status_detail: order.status_detail || null,
        estado: estaAprobado ? "pagado" : pedido.estado,
        pagado_at: estaAprobado ? pedido.pagado_at || ahora : pedido.pagado_at,
        updated_at: ahora,
      })
      .eq("id", pedido.id);

    if (updateError) throw updateError;
    if (!estaAprobado) return NextResponse.json({ received: true });

    const { data: pedidoActualizado, error: fetchError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedido.id)
      .single();

    if (fetchError || !pedidoActualizado) {
      throw fetchError || new Error("No se pudo recuperar el pedido actualizado.");
    }

    if (!pedidoActualizado.email_enviado_at) {
      await enviarEmailPedidoPagado(
        {
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
        },
        {
          id: pagoId,
          status: pago?.status || order.status || "processed",
          status_detail: pago?.status_detail || order.status_detail,
        }
      );

      const { error: emailUpdateError } = await supabase
        .from("pedidos")
        .update({
          email_enviado_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", pedido.id)
        .is("email_enviado_at", null);

      if (emailUpdateError) throw emailUpdateError;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Mercado Pago:", error);
    return NextResponse.json({ error: "Error procesando webhook." }, { status: 500 });
  }
}
