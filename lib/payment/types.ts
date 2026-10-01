export type ClientePedido = {
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  telefono: string;
  direccion: string;
  numero: string;
  depto?: string;
  comuna: string;
  region: string;
};

export type ItemPedido = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
};

export type OrdenPago = {
  numero: string;
  items: ItemPedido[];
  subtotal: number;
  costoEnvio: number;
  total: number;
  cliente: ClientePedido;
};

export type ResultadoPago = {
  redireccionar: boolean;
  url?: string;
  orderId?: string;
};

export interface PaymentProvider {
  nombre: string;
  crearPago(orden: OrdenPago): Promise<ResultadoPago>;
}
