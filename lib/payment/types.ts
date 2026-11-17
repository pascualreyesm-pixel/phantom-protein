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
  precio: number; // precio unitario efectivamente cobrado
  precioOriginal?: number;
  cantidad: number;
  subtotal: number; // subtotal efectivamente cobrado
  subtotalOriginal?: number;
  descuento?: number;
};

export type OrdenPago = {
  numero: string;
  tokenConfirmacion: string;
  items: ItemPedido[];
  subtotal: number; // antes del descuento
  descuento: number;
  codigoDescuento: string | null;
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
