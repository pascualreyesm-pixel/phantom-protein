import { randomUUID } from "node:crypto";
import { PaymentProvider, OrdenPago, ResultadoPago } from "./types";

function normalizarBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const mercadoPagoProvider: PaymentProvider = {
  nombre: "mercadopago",

  async crearPago(orden: OrdenPago): Promise<ResultadoPago> {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const baseUrlRaw = process.env.NEXT_PUBLIC_URL;

    if (!token) {
      throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en .env.local.");
    }

    if (!baseUrlRaw) {
      throw new Error("Falta NEXT_PUBLIC_URL en .env.local.");
    }

    const baseUrl = normalizarBaseUrl(baseUrlRaw);

    if (!/^https:\/\//i.test(baseUrl)) {
      throw new Error(
        "NEXT_PUBLIC_URL debe ser una URL HTTPS pública para Mercado Pago."
      );
    }

    const items = orden.items.map((item) => ({
      id: item.id,
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: String(item.precio),
      total_amount: String(item.subtotal),
      unit_measure: "unit",
    }));

    if (orden.costoEnvio > 0) {
      items.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: String(orden.costoEnvio),
        total_amount: String(orden.costoEnvio),
        unit_measure: "unit",
      });
    }

    const successUrl = `${baseUrl}/pedido/confirmacion?numero=${encodeURIComponent(orden.numero)}&status=approved`;
    const pendingUrl = `${baseUrl}/pedido/confirmacion?numero=${encodeURIComponent(orden.numero)}&status=pending`;
    const failureUrl = `${baseUrl}/checkout?payment=failed&numero=${encodeURIComponent(orden.numero)}`;

    const respuesta = await fetch("https://api.mercadopago.com/v1/orders", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify({
        type: "online",
        processing_mode: "manual",
        capture_mode: "automatic_async",
        external_reference: orden.numero,
        total_amount: String(orden.total),
        description: `Pedido Phantom Protein ${orden.numero}`,
        payer: {
          email: orden.cliente.email,
          name: orden.cliente.nombre,
          surname: orden.cliente.apellido,
        },
        items,
        config: {
          online: {
            success_url: successUrl,
            failure_url: failureUrl,
            pending_url: pendingUrl,
            auto_return: "approved",
          },
        },
      }),
      cache: "no-store",
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Mercado Pago rechazó la solicitud: ${detalle}`);
    }

    const datos = (await respuesta.json()) as {
      id?: string;
      checkout_url?: string;
    };

    if (!datos.id || !datos.checkout_url) {
      throw new Error("Mercado Pago no devolvió una orden o checkout_url válida.");
    }

    return {
      redireccionar: true,
      url: datos.checkout_url,
      orderId: datos.id,
    };
  },
};
