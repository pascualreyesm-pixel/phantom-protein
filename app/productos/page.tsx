import type { Metadata } from "next";
import Image from "next/image";
import { productos } from "@/lib/productos";
import AgregarCarritoBoton from "@/components/agregar-carrito-boton";
import SchemaProductos from "@/components/schema-productos";

const dorado =
  "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] bg-clip-text text-transparent";

export const metadata: Metadata = {
  title: "Productos",
  description: "Catálogo completo Phantom Protein: proteína, creatina y colágeno.",
};

export default function ProductosPage() {
  return (
    <section className="bg-black px-6 py-32">
      <SchemaProductos />

      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-sm tracking-widest text-white">
          CATÁLOGO COMPLETO
        </span>
        <h1 className="text-4xl text-white [font-family:var(--font-anton)] md:text-5xl">
          TODOS NUESTROS <span className={dorado}>PRODUCTOS</span>
        </h1>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-[#D4AF37]/40"
          >
            <div className="relative mb-6 flex h-56 items-center justify-center">
              <div className="absolute h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-2xl" />
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                width={200}
                height={200}
                className="relative z-10 h-full w-auto object-contain"
              />
            </div>

            <span className={`mb-1 text-xs font-semibold uppercase tracking-wider ${dorado}`}>
              {producto.categoria}
            </span>
            <h2 className="mb-2 text-2xl text-white [font-family:var(--font-anton)]">
              {producto.nombre}
            </h2>
            <p className={`mb-4 text-lg font-semibold ${dorado}`}>
              ${producto.precio.toLocaleString("es-CL")}
            </p>
            <p className="mb-5 text-sm leading-6 text-gray-400">
              {producto.descripcion}
            </p>
            <ul className="mb-6 space-y-1.5 text-sm text-gray-400">
              {producto.detalles.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>

            <AgregarCarritoBoton producto={producto} />
          </div>
        ))}
      </div>
    </section>
  );
}
