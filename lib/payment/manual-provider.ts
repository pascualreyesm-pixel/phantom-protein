import { PaymentProvider, OrdenPago, ResultadoPago } from "./types";

// Proveedor "manual": no cobra nada, no redirige a ninguna pasarela.
// El pedido queda "pendiente_de_pago" y ustedes coordinan el pago
// directamente con el cliente. Cuando conecten Mercado Pago, crean
// MercadoPagoProvider implementando esta misma interfaz y lo activan
// en payment/index.ts — nada más se toca.
export const manualProvider: PaymentProvider = {
  nombre: "manual",
  async crearPago(_orden: OrdenPago): Promise<ResultadoPago> {
    return { redireccionar: false };
  },
};
