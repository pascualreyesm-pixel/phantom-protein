import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { productos, COSTO_ENVIO } from "@/lib/productos";
import { generarNumeroPedido, ESTADO_LABEL } from "@/lib/pedidos";
import { paymentProvider } from "@/lib/payment";

const resend = new Resend(process.env.RESEND_API_KEY);

type ItemRecibido = { id: string; cantidad: number };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, cliente } = body as {
      items: ItemRecibido[];
      cliente: {
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
    };

    if (!items?.length) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }
    const camposRequeridos = [
      "nombre", "apellido", "rut", "email", "telefono",
      "direccion", "numero", "comuna", "region",
    ] as const;
    for (const campo of camposRequeridos) {
      if (!cliente?.[campo]) {
        return NextResponse.json(
          { error: `Falta el campo: ${campo}` },
          { status: 400 }
        );
      }
    }

    const itemsResueltos = items.map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      if (!producto) throw new Error(`Producto no encontrado: ${item.id}`);
      return {
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: item.cantidad,
        subtotal: producto.precio * item.cantidad,
      };
    });

    const subtotal = itemsResueltos.reduce((acc, i) => acc + i.subtotal, 0);
    const total = subtotal + COSTO_ENVIO;
    const numero = generarNumeroPedido();
    const fecha = new Date().toLocaleString("es-CL");
    const estado = "pendiente_de_pago" as const;

    const resultadoPago = await paymentProvider.crearPago({ numero, total });

    const filasProductos = itemsResueltos
      .map(
        (i) =>
          `<tr><td>${i.nombre}</td><td>${i.cantidad}</td><td>$${i.precio.toLocaleString("es-CL")}</td><td>$${i.subtotal.toLocaleString("es-CL")}</td></tr>`
      )
      .join("");

    if (!process.env.RESEND_API_KEY || !process.env.PEDIDO_EMAIL_DESTINO) {
      return NextResponse.json(
        { error: "Falta RESEND_API_KEY o PEDIDO_EMAIL_DESTINO en .env.local (¿reiniciaste el servidor después de crearlo?)" },
        { status: 500 }
      );
    }

    const envio = await resend.emails.send({
      from: "Phantom Protein <onboarding@resend.dev>",
      to: process.env.PEDIDO_EMAIL_DESTINO as string,
      subject: `Pedido ${numero} — ${cliente.nombre} ${cliente.apellido}`,
      html: `
        <h2>Nuevo pedido Phantom Protein</h2>
        <p><strong>N° de pedido:</strong> ${numero}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Estado:</strong> ${ESTADO_LABEL[estado]}</p>
        <hr />
        <h3>Cliente</h3>
        <p><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellido}</p>
        <p><strong>RUT:</strong> ${cliente.rut}</p>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
        <p><strong>Dirección:</strong> ${cliente.direccion} ${cliente.numero} ${cliente.depto || ""}</p>
        <p><strong>Comuna:</strong> ${cliente.comuna}</p>
        <p><strong>Región:</strong> ${cliente.region}</p>
        <hr />
        <h3>Productos</h3>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><th align="left">Producto</th><th align="left">Cant.</th><th align="left">Precio</th><th align="left">Subtotal</th></tr>
          ${filasProductos}
        </table>
        <p><strong>Subtotal:</strong> $${subtotal.toLocaleString("es-CL")}</p>
        <p><strong>Envío:</strong> $${COSTO_ENVIO.toLocaleString("es-CL")}</p>
        <p><strong>Total:</strong> $${total.toLocaleString("es-CL")}</p>
      `,
    });

    if (envio.error) {
      return NextResponse.json({ error: `Resend: ${envio.error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      numero,
      redireccionar: resultadoPago.redireccionar,
      url: resultadoPago.url ?? null,
    });
  } catch (error) {
    console.error(error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
