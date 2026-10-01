import { NextRequest, NextResponse } from "next/server";
import { productos, COSTO_ENVIO } from "@/lib/productos";
import { generarNumeroPedido } from "@/lib/pedidos";
import { paymentProvider } from "@/lib/payment";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { ClientePedido, ItemPedido } from "@/lib/payment/types";

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
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

function texto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const itemsRecibidos = Array.isArray(body?.items) ? body.items : [];
    const cliente = body?.cliente as Partial<ClientePedido> | undefined;

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

    const camposRequeridos: (keyof ClientePedido)[] = [
      "nombre", "apellido", "rut", "email", "telefono",
      "direccion", "numero", "comuna", "region",
    ];

    for (const campo of camposRequeridos) {
      if (!clienteNormalizado[campo]) {
        return NextResponse.json({ error: `Falta el campo: ${campo}` }, { status: 400 });
      }
    }

    if (!rutValido(clienteNormalizado.rut)) {
      return NextResponse.json({ error: "RUT inválido." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(clienteNormalizado.email)) {
      return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
    }

    const itemsResueltos: ItemPedido[] = [];

    for (const item of itemsRecibidos) {
      const id = texto(item?.id);
      const cantidad = Number(item?.cantidad);

      if (!id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
        return NextResponse.json(
          { error: "Hay un producto o cantidad inválida en el carrito." },
          { status: 400 }
        );
      }

      const producto = productos.find((p) => p.id === id);
      if (!producto) {
        return NextResponse.json({ error: `Producto no encontrado: ${id}` }, { status: 400 });
      }

      itemsResueltos.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        subtotal: producto.precio * cantidad,
      });
    }

    const subtotal = itemsResueltos.reduce((acc, item) => acc + item.subtotal, 0);
    const total = subtotal + COSTO_ENVIO;
    const numero = generarNumeroPedido();
    const supabase = getSupabaseServer();

    const { data: pedidoCreado, error: insertError } = await supabase
      .from("pedidos")
      .insert({
        numero_pedido: numero,
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
        items: itemsResueltos,
        subtotal,
        costo_envio: COSTO_ENVIO,
        total,
      })
      .select("id")
      .single();

    if (insertError || !pedidoCreado) {
      console.error("Error guardando pedido:", insertError);
      return NextResponse.json({ error: "No se pudo guardar el pedido." }, { status: 500 });
    }

    try {
      const resultadoPago = await paymentProvider.crearPago({
        numero,
        items: itemsResueltos,
        subtotal,
        costoEnvio: COSTO_ENVIO,
        total,
        cliente: clienteNormalizado,
      });

      const { error: updateError } = await supabase
        .from("pedidos")
        .update({
          mercadopago_order_id: resultadoPago.orderId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pedidoCreado.id);

      if (updateError) {
        console.error("No se pudo guardar el ID de order de Mercado Pago:", updateError);
      }

      return NextResponse.json({
        numero,
        redireccionar: resultadoPago.redireccionar,
        url: resultadoPago.url ?? null,
      });
    } catch (error) {
      const { error: deleteError } = await supabase
        .from("pedidos")
        .delete()
        .eq("id", pedidoCreado.id);

      if (deleteError) {
        console.error("No se pudo limpiar el pedido fallido:", deleteError);
      }

      throw error;
    }
  } catch (error) {
    console.error(error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
