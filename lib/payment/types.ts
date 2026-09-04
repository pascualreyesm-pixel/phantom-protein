export type OrdenPago = {
  numero: string;
  total: number;
};

export type ResultadoPago = {
  redireccionar: boolean;
  url?: string;
};

export interface PaymentProvider {
  nombre: string;
  crearPago(orden: OrdenPago): Promise<ResultadoPago>;
}
