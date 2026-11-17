import { getSupabaseServer } from "@/lib/supabase/server";
import { enviarEmailPedidoPagado } from "@/lib/email/pedido";

export type ResultadoSincronizacionPago = {
  numero: string;
  status: string;
  pagado: boolean;
  emailEnviado: boolean;
};

type PagoMercadoPago = {
  id?: string | number;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number | string;
  currency_id?: string;
};

async function obtenerPago(paymentId: string): Promise<PagoMercadoPago> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Pago no pudo consultar el pago (${response.status}): ${detail}`);
  }
  return (await response.json()) as PagoMercadoPago;
}

/**
 * Consulta el pago directamente a Mercado Pago. Nunca confía en el status
 * devuelto por el navegador ni marca pagado por un simple redirect.
 */
export async function sincronizarPagoMercadoPago(
  paymentId: string,
  opciones: { numeroEsperado?: string; tokenConfirmacion?: string } = {},
): Promise<ResultadoSincronizacionPago> {
  const pago = await obtenerPago(paymentId);
  const numeroPedido = pago.external_reference?.trim();
  if (!numeroPedido) throw new Error("El pago no incluye external_reference.");
  if (opciones.numeroEsperado && opciones.numeroEsperado !== numeroPedido) {
    throw new Error("El pago no corresponde al pedido solicitado.");
  }

  const supabase = getSupabaseServer();
  let consulta = supabase.from("pedidos").select("*").eq("numero_pedido", numeroPedido);
  if (opciones.tokenConfirmacion) consulta = consulta.eq("token_confirmacion", opciones.tokenConfirmacion);
  const { data: pedido, error: pedidoError } = await consulta.maybeSingle();
  if (pedidoError) throw pedidoError;
  if (!pedido) throw new Error("No encontramos el pedido asociado a este pago.");

  const montoPago = Number(pago.transaction_amount);
  const montoPedido = Number(pedido.total);
  if (!Number.isFinite(montoPago) || montoPago !== montoPedido || pago.currency_id !== "CLP") {
    console.error("Monto o moneda del pago no coincide con el pedido", {
      numeroPedido,
      montoPago,
      montoPedido,
      currency: pago.currency_id,
    });
    await supabase.from("pedidos").update({
      mercadopago_payment_id: String(pago.id || paymentId),
      mercadopago_status: pago.status || null,
      mercadopago_status_detail: pago.status_detail || null,
      updated_at: new Date().toISOString(),
    }).eq("id", pedido.id);
    throw new Error("El monto o la moneda del pago no coincide con el pedido.");
  }

  const aprobado = pago.status === "approved";
  const yaPagado = pedido.estado === "pagado" || Boolean(pedido.pagado_at);
  const ahora = new Date().toISOString();
  const { error: updateError } = await supabase.from("pedidos").update({
    mercadopago_payment_id: String(pago.id || paymentId),
    mercadopago_status: aprobado || yaPagado ? "approved" : (pago.status || null),
    mercadopago_status_detail: pago.status_detail || pedido.mercadopago_status_detail || null,
    estado: aprobado || yaPagado ? "pagado" : pedido.estado,
    pagado_at: aprobado || yaPagado ? pedido.pagado_at || ahora : pedido.pagado_at,
    updated_at: ahora,
  }).eq("id", pedido.id);
  if (updateError) throw updateError;

  if (!aprobado && !yaPagado) {
    return {
      numero: numeroPedido,
      status: pago.status || "pending",
      pagado: false,
      emailEnviado: Boolean(pedido.email_enviado_at),
    };
  }

  const { data: actual, error: fetchError } = await supabase
    .from("pedidos").select("*").eq("id", pedido.id).single();
  if (fetchError || !actual) throw fetchError || new Error("No se pudo recuperar el pedido actualizado.");

  let emailEnviado = Boolean(actual.email_enviado_at);
  if (!emailEnviado) {
    await enviarEmailPedidoPagado({
      numero_pedido: actual.numero_pedido,
      fecha: new Date(actual.created_at).toLocaleString("es-CL", { timeZone: "America/Santiago" }),
      cliente: {
        nombre: actual.cliente_nombre,
        apellido: actual.cliente_apellido,
        rut: actual.cliente_rut,
        email: actual.cliente_email,
        telefono: actual.cliente_telefono,
        direccion: actual.direccion,
        numero: actual.numero_direccion,
        depto: actual.depto || "",
        comuna: actual.comuna,
        region: actual.region,
      },
      items: actual.items,
      subtotal: Number(actual.subtotal),
      descuento: Number(actual.descuento || 0),
      codigo_descuento: actual.codigo_descuento || null,
      costo_envio: Number(actual.costo_envio),
      total: Number(actual.total),
    }, {
      id: String(pago.id || paymentId),
      status: pago.status || "approved",
      status_detail: pago.status_detail,
    });

    const { error: emailUpdateError } = await supabase.from("pedidos").update({
      email_enviado_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", pedido.id).is("email_enviado_at", null);
    if (emailUpdateError) throw emailUpdateError;
    emailEnviado = true;
  }

  return { numero: numeroPedido, status: "approved", pagado: true, emailEnviado };
}
