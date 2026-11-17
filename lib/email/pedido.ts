import { Resend } from "resend";
import type { ClientePedido, ItemPedido } from "@/lib/payment/types";

export type PedidoEmail = {
  numero_pedido: string;
  fecha: string;
  cliente: ClientePedido;
  items: ItemPedido[];
  subtotal: number;
  descuento: number;
  codigo_descuento?: string | null;
  costo_envio: number;
  total: number;
};

type PagoEmail = { id: string; status: string; status_detail?: string | null };

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function pesos(valor: number) { return `$${valor.toLocaleString("es-CL")}`; }

export async function enviarEmailPedidoPagado(pedido: PedidoEmail, pago: PagoEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.PEDIDO_EMAIL_DESTINO;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !destino || !from) throw new Error("Falta RESEND_API_KEY, PEDIDO_EMAIL_DESTINO o RESEND_FROM_EMAIL.");

  const cliente = pedido.cliente;
  const direccionCompleta = [cliente.direccion, cliente.numero, cliente.depto].filter(Boolean).join(" ");
  const filasProductos = pedido.items.map((item) => {
    const precioOriginal = Number(item.precioOriginal ?? item.precio);
    const subtotalOriginal = Number(item.subtotalOriginal ?? item.subtotal);
    const precioHtml = precioOriginal > item.precio
      ? `<del style="color:#999">${pesos(precioOriginal)}</del> <strong>${pesos(item.precio)}</strong>`
      : pesos(item.precio);
    const subtotalHtml = subtotalOriginal > item.subtotal
      ? `<del style="color:#999">${pesos(subtotalOriginal)}</del> <strong>${pesos(item.subtotal)}</strong>`
      : pesos(item.subtotal);
    return `<tr><td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.nombre)}</td><td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.cantidad}</td><td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${precioHtml}</td><td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${subtotalHtml}</td></tr>`;
  }).join("");

  const esPreview = process.env.VERCEL_ENV === "preview";
  const asunto = esPreview
    ? `[PRUEBA SANDBOX] Pedido pagado ${pedido.numero_pedido} — ${cliente.nombre} ${cliente.apellido}`
    : `Pedido pagado ${pedido.numero_pedido} — ${cliente.nombre} ${cliente.apellido}`;
  const avisoPreview = esPreview
    ? `<div style="margin:0 0 18px;padding:12px 14px;border:1px solid #f0d28c;border-radius:10px;background:#fff8e7;color:#7a4d00;font-size:13px"><strong>ENTORNO DE PRUEBA:</strong> pago simulado con credenciales sandbox. No preparar ni despachar este pedido.</div>`
    : "";

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: [destino],
    subject: asunto,
    html: `<div style="margin:0;background:#f3f4f6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111827"><div style="max-width:720px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb"><div style="background:#050505;color:white;padding:28px 32px"><p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;color:#D4AF37;font-weight:700">PHANTOM PROTEIN</p><h1 style="margin:0;font-size:28px">Pedido pagado ✓</h1><p style="margin:10px 0 0;color:#d1d5db">${escapeHtml(pedido.numero_pedido)}</p></div><div style="padding:28px 32px">${avisoPreview}<div style="padding:16px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;margin-bottom:24px"><strong style="color:#065f46">Pago aprobado</strong><div style="margin-top:6px;color:#047857">Mercado Pago · ID ${escapeHtml(pago.id)}</div>${pago.status_detail ? `<div style="margin-top:4px;color:#047857;font-size:13px">Detalle: ${escapeHtml(pago.status_detail)}</div>` : ""}</div><h2 style="font-size:18px;margin:0 0 12px">Cliente</h2><p><strong>Nombre:</strong> ${escapeHtml(cliente.nombre)} ${escapeHtml(cliente.apellido)}</p><p><strong>RUT:</strong> ${escapeHtml(cliente.rut)}</p><p><strong>Email:</strong> ${escapeHtml(cliente.email)}</p><p><strong>Teléfono:</strong> ${escapeHtml(cliente.telefono)}</p><h2 style="font-size:18px;margin:24px 0 12px">Despacho</h2><p><strong>Dirección:</strong> ${escapeHtml(direccionCompleta)}</p><p><strong>Comuna:</strong> ${escapeHtml(cliente.comuna)}</p><p><strong>Región:</strong> ${escapeHtml(cliente.region)}</p><h2 style="font-size:18px;margin:24px 0 12px">Productos</h2><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="background:#f9fafb"><th style="padding:10px 8px;text-align:left">Producto</th><th style="padding:10px 8px;text-align:center">Cant.</th><th style="padding:10px 8px;text-align:right">Precio</th><th style="padding:10px 8px;text-align:right">Subtotal</th></tr></thead><tbody>${filasProductos}</tbody></table><div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb"><p><strong>Subtotal:</strong> ${pesos(pedido.subtotal)}</p>${pedido.descuento > 0 ? `<p style="color:#087443"><strong>Descuento${pedido.codigo_descuento ? ` (${escapeHtml(pedido.codigo_descuento)})` : ""}:</strong> −${pesos(pedido.descuento)}</p>` : ""}<p><strong>Envío:</strong> ${pesos(pedido.costo_envio)}</p><p style="font-size:20px"><strong>Total: ${pesos(pedido.total)}</strong></p></div><p style="margin:24px 0 0;color:#6b7280;font-size:13px">Fecha del pedido: ${escapeHtml(pedido.fecha)}</p></div></div></div>`,
  }, { idempotencyKey: `pedido-pagado/${pedido.numero_pedido}` });

  if (error) throw new Error(`Resend: ${error.message}`);
}
