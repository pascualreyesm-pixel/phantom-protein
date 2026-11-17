import { PaymentProvider, OrdenPago, ResultadoPago } from "./types";

function obtenerBaseUrl() {
  // Preview debe volver y notificar al deployment aislado, no a la tienda real.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }
  const raw = process.env.NEXT_PUBLIC_URL;
  if (!raw) throw new Error("Falta NEXT_PUBLIC_URL en las variables de entorno.");
  const url = raw.replace(/\/+$/, "");
  if (!/^https:\/\//i.test(url)) throw new Error("NEXT_PUBLIC_URL debe ser una URL HTTPS pública para Mercado Pago.");
  return url;
}

export const mercadoPagoProvider: PaymentProvider = {
  nombre: "mercadopago",

  async crearPago(orden: OrdenPago): Promise<ResultadoPago> {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");

    const baseUrl = obtenerBaseUrl();
    const productos = orden.items.map((item) => ({
      id: item.id,
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "CLP",
    }));
    const items = orden.costoEnvio > 0
      ? [...productos, { id: "shipping", title: "Envío", quantity: 1, unit_price: orden.costoEnvio, currency_id: "CLP" }]
      : productos;

    const params = `numero=${encodeURIComponent(orden.numero)}&token=${encodeURIComponent(orden.tokenConfirmacion)}`;
    const respuesta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": `phantom-${orden.numero}`,
      },
      body: JSON.stringify({
        items,
        external_reference: orden.numero,
        payer: {
          name: orden.cliente.nombre,
          surname: orden.cliente.apellido,
          email: orden.cliente.email,
        },
        back_urls: {
          success: `${baseUrl}/pedido/confirmacion?${params}`,
          pending: `${baseUrl}/pedido/confirmacion?${params}&resultado=pending`,
          failure: `${baseUrl}/pedido/confirmacion?${params}&resultado=failure`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "PHANTOM PROTEIN",
        metadata: {
          numero_pedido: orden.numero,
          codigo_descuento: orden.codigoDescuento,
          descuento_clp: orden.descuento,
        },
      }),
      cache: "no-store",
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("Error creando preferencia Mercado Pago:", respuesta.status, detalle);
      throw new Error(`Mercado Pago rechazó la creación del pago (HTTP ${respuesta.status}): ${detalle}`);
    }

    const datos = (await respuesta.json()) as { id?: string; init_point?: string };
    if (!datos.id || !datos.init_point) {
      throw new Error("Mercado Pago no devolvió una preferencia o init_point válida.");
    }

    return { redireccionar: true, url: datos.init_point, orderId: datos.id };
  },
};
