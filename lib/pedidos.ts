export function generarNumeroPedido() {
  const fecha = new Date();
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const azar = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PH-${yyyy}${mm}${dd}-${azar}`;
}

export type EstadoPedido =
  | "pendiente_de_pago"
  | "pagado"
  | "preparando"
  | "despachado"
  | "entregado"
  | "cancelado";

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  pendiente_de_pago: "Pendiente de pago",
  pagado: "Pagado",
  preparando: "Preparando",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
