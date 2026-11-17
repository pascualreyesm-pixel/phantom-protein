export const CODIGO_DESCUENTO = "BLACKPHANTOM15";
export const PORCENTAJE_DESCUENTO = 15;

export type ItemParaDescuento = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type ItemCalculado = ItemParaDescuento & {
  precioOriginal: number;
  precio: number;
  subtotalOriginal: number;
  subtotal: number;
  descuento: number;
};

export function productoExcluidoDePromocion(id: string) {
  return id === "creatina" || id.startsWith("pack-");
}

/** Calcula el descuento por unidad para que los valores cobrados por Mercado Pago sean enteros CLP. */
export function calcularDescuento(items: ItemParaDescuento[], codigo?: string) {
  const codigoNormalizado = (codigo ?? "").trim().toUpperCase();
  const codigoIngresado = codigoNormalizado.length > 0;
  const codigoValido = codigoNormalizado === CODIGO_DESCUENTO;

  const itemsCalculados: ItemCalculado[] = items.map((item) => {
    const aplica = codigoValido && !productoExcluidoDePromocion(item.id);
    const descuentoUnitario = aplica ? Math.round(item.precio * PORCENTAJE_DESCUENTO / 100) : 0;
    const precioFinal = Math.max(0, item.precio - descuentoUnitario);
    return {
      ...item,
      precioOriginal: item.precio,
      precio: precioFinal,
      subtotalOriginal: item.precio * item.cantidad,
      subtotal: precioFinal * item.cantidad,
      descuento: descuentoUnitario * item.cantidad,
    };
  });

  const subtotalOriginal = itemsCalculados.reduce((suma, item) => suma + item.subtotalOriginal, 0);
  const subtotal = itemsCalculados.reduce((suma, item) => suma + item.subtotal, 0);
  const descuento = itemsCalculados.reduce((suma, item) => suma + item.descuento, 0);
  const elegibles = itemsCalculados.some((item) => !productoExcluidoDePromocion(item.id));

  return {
    items: itemsCalculados,
    codigoIngresado,
    codigoValido,
    codigoAplicado: codigoValido && descuento > 0,
    codigoNoAplica: codigoValido && !elegibles,
    subtotalOriginal,
    subtotal,
    descuento,
    codigoDescuento: codigoValido && descuento > 0 ? CODIGO_DESCUENTO : null,
  };
}
