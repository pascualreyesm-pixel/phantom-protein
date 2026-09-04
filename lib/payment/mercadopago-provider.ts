import { PaymentProvider, OrdenPago, ResultadoPago } from "./types";

// Requiere estas 2 variables en .env.local (las obtienen del panel de
// desarrolladores de Mercado Pago — NO son las mismas credenciales que
// usan las máquinas Point de cobro presencial):
// MERCADOPAGO_ACCESS_TOKEN=...
// NEXT_PUBLIC_URL=https://phantomprotein.cl  (o http://localhost:3000 en desarrollo)
export const mercadoPagoProvider: PaymentProvider = {
  nombre: "mercadopago",
  async crearPago(orden: OrdenPago): Promise<ResultadoPago> {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_URL;

    if (!token || !baseUrl) {
      throw new Error(
        "Falta MERCADOPAGO_ACCESS_TOKEN o NEXT_PUBLIC_URL en .env.local"
      );
    }

    const respuesta = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              title: `Pedido Phantom Protein ${orden.numero}`,
              quantity: 1,
              unit_price: orden.total,
              currency_id: "CLP",
            },
          ],
          external_reference: orden.numero,
          back_urls: {
            success: `${baseUrl}/pedido/confirmacion?numero=${orden.numero}`,
            failure: `${baseUrl}/checkout`,
            pending: `${baseUrl}/pedido/confirmacion?numero=${orden.numero}`,
          },
          auto_return: "approved",
        }),
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Mercado Pago rechazó la solicitud: ${detalle}`);
    }

    const datos = await respuesta.json();
    return { redireccionar: true, url: datos.init_point };
  },
};
