import { randomUUID } from "node:crypto";
import { PaymentProvider, OrdenPago, ResultadoPago } from "./types";

function normalizarBaseUrl(url: string) {
  const parsed = new URL(url);
  // El dominio apex redirige a www en Vercel. Mercado Pago debe recibir
  // directamente la URL canónica para evitar respuestas 308 en el webhook.
  if (parsed.hostname === "phantomprotein.cl") parsed.hostname = "www.phantomprotein.cl";
  return parsed.toString().replace(/\/+$/, "");
}

export const mercadoPagoProvider: PaymentProvider = {
  nombre: "mercadopago",

  async crearPago(orden: OrdenPago): Promise<ResultadoPago> {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const baseUrlRaw = process.env.NEXT_PUBLIC_URL;

    if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");
    if (!baseUrlRaw) throw new Error("Falta NEXT_PUBLIC_URL en las variables de entorno.");

    let baseUrl: string;
    try {
      baseUrl = normalizarBaseUrl(baseUrlRaw);
    } catch {
      throw new Error("NEXT_PUBLIC_URL debe ser una URL HTTPS pública válida.");
    }
    if (!/^https:\/\//i.test(baseUrl)) {
      throw new Error("NEXT_PUBLIC_URL debe ser una URL HTTPS pública para Mercado Pago.");
    }

    const items = orden.items.map((item) => ({
      id: item.id,
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "CLP",
    }));

    if (orden.costoEnvio > 0) {
      items.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: orden.costoEnvio,
        currency_id: "CLP",
      });
    }

    const respuesta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": randomUUID(),
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
          success: `${baseUrl}/pedido/confirmacion?numero=${encodeURIComponent(orden.numero)}&status=approved`,
          pending: `${baseUrl}/pedido/confirmacion?numero=${encodeURIComponent(orden.numero)}&status=pending`,
          failure: `${baseUrl}/checkout?payment=failed&numero=${encodeURIComponent(orden.numero)}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "PHANTOM PROTEIN",
        metadata: { numero_pedido: orden.numero },
      }),
      cache: "no-store",
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("Error creando preferencia Mercado Pago:", respuesta.status, detalle);
      throw new Error(`Mercado Pago rechazó la creación del pago (HTTP ${respuesta.status}): ${detalle}`);
    }

    const datos = (await respuesta.json()) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    if (!datos.id || !datos.init_point) {
      throw new Error("Mercado Pago no devolvió una preferencia o init_point válida.");
    }

    return {
      redireccionar: true,
      url: datos.init_point,
      orderId: datos.id,
    };
  },
};
