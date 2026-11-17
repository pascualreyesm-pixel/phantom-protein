import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { productos, COSTO_ENVIO } from "@/lib/productos";
import { generarNumeroPedido } from "@/lib/pedidos";
import { calcularDescuento, type ItemParaDescuento } from "@/lib/descuentos";
import { paymentProvider } from "@/lib/payment";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { ClientePedido } from "@/lib/payment/types";

export const runtime = "nodejs";

function rutValido(rut: string) {
  const limpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === esperado;
}

function texto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function POST(request: NextRequest) {
  let pedidoId: string | null = null;
  try {
    const body = await request.json();
    const itemsRecibidos = Array.isArray(body?.items) ? body.items : [];
    const cliente = body?.cliente as Partial<ClientePedido> | undefined;
    const codigoDescuento = texto(body?.codigoDescuento);

    if (itemsRecibidos.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    const clienteNormalizado: ClientePedido = {
      nombre: texto(cliente?.nombre),
      apellido: texto(cliente?.apellido),
      rut: texto(cliente?.rut).toUpperCase(),
      email: texto(cliente?.email).toLowerCase(),
      telefono: texto(cliente?.telefono),
      direccion: texto(cliente?.direccion),
      numero: texto(cliente?.numero),
      depto: texto(cliente?.depto),
      comuna: texto(cliente?.comuna),
      region: texto(cliente?.region),
    };

    const requeridos: (keyof ClientePedido)[] = ["nombre", "apellido", "rut", "email", "telefono", "direccion", "numero", "comuna", "region"];
    for (const campo of requeridos) {
      if (!clienteNormalizado[campo]) return NextResponse.json({ error: `Falta el campo: ${campo}` }, { status: 400 });
    }
    if (!rutValido(clienteNormalizado.rut)) return NextResponse.json({ error: "RUT inválido." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(clienteNormalizado.email)) return NextResponse.json({ error: "Correo inválido." }, { status: 400 });

    const itemsBase: ItemParaDescuento[] = [];
    for (const raw of itemsRecibidos) {
      const id = texto(raw?.id);
      const cantidad = Number(raw?.cantidad);
      if (!id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
        return NextResponse.json({ error: "Hay un producto o cantidad inválida en el carrito." }, { status: 400 });
      }
      const producto = productos.find((p) => p.id === id);
      if (!producto) return NextResponse.json({ error: `Producto no encontrado: ${id}` }, { status: 400 });
      itemsBase.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad });
    }

    const calculo = calcularDescuento(itemsBase, codigoDescuento);
    if (codigoDescuento && !calculo.codigoValido) {
      return NextResponse.json({ error: `El código ${codigoDescuento.toUpperCase()} no es válido.` }, { status: 400 });
    }
    if (codigoDescuento && calculo.codigoNoAplica) {
      return NextResponse.json({ error: "BLACKPHANTOM15 no se aplica a creatina ni al pack proteína + creatina." }, { status: 400 });
    }

    const subtotal = calculo.subtotalOriginal;
    const descuento = calculo.descuento;
    const total = calculo.subtotal + COSTO_ENVIO;
    const numero = generarNumeroPedido();
    const tokenConfirmacion = randomUUID();
    const supabase = getSupabaseServer();

    const { data: creado, error: insertError } = await supabase.from("pedidos").insert({
      numero_pedido: numero,
      token_confirmacion: tokenConfirmacion,
      estado: "pendiente_de_pago",
      cliente_nombre: clienteNormalizado.nombre,
      cliente_apellido: clienteNormalizado.apellido,
      cliente_rut: clienteNormalizado.rut,
      cliente_email: clienteNormalizado.email,
      cliente_telefono: clienteNormalizado.telefono,
      direccion: clienteNormalizado.direccion,
      numero_direccion: clienteNormalizado.numero,
      depto: clienteNormalizado.depto || null,
      comuna: clienteNormalizado.comuna,
      region: clienteNormalizado.region,
      items: calculo.items,
      subtotal,
      descuento,
      codigo_descuento: calculo.codigoDescuento,
      costo_envio: COSTO_ENVIO,
      total,
    }).select("id").single();

    if (insertError || !creado) {
      console.error("Error guardando pedido:", insertError);
      return NextResponse.json({ error: "No se pudo guardar el pedido. Comprueba que ejecutaste la migración SQL incluida." }, { status: 500 });
    }
    pedidoId = creado.id;

    const resultadoPago = await paymentProvider.crearPago({
      numero,
      tokenConfirmacion,
      items: calculo.items,
      subtotal,
      descuento,
      codigoDescuento: calculo.codigoDescuento,
      costoEnvio: COSTO_ENVIO,
      total,
      cliente: clienteNormalizado,
    });

    const { error: updateError } = await supabase.from("pedidos").update({
      mercadopago_order_id: resultadoPago.orderId || null,
      updated_at: new Date().toISOString(),
    }).eq("id", creado.id);
    if (updateError) throw updateError;

    return NextResponse.json({
      numero,
      redireccionar: resultadoPago.redireccionar,
      url: resultadoPago.url ?? null,
      subtotal,
      descuento,
      total,
    });
  } catch (error) {
    if (pedidoId) {
      try {
        await getSupabaseServer().from("pedidos").delete().eq("id", pedidoId).eq("estado", "pendiente_de_pago");
      } catch (cleanupError) {
        console.error("No se pudo limpiar un pedido cuya preferencia falló:", cleanupError);
      }
    }
    console.error("Error creando pedido:", error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
