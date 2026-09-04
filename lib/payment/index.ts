import { manualProvider } from "./manual-provider";
import { PaymentProvider } from "./types";

// Proveedor de pago activo. Cuando tengan credenciales de Mercado Pago:
// import { mercadoPagoProvider } from "./mercadopago-provider";
// export const paymentProvider: PaymentProvider = mercadoPagoProvider;
export const paymentProvider: PaymentProvider = manualProvider;
