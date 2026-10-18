import Image from "next/image";
import Link from "next/link";
import { catalogoProductos, getProducto } from "@/lib/catalogo";
import AgregarCarritoBoton from "@/components/agregar-carrito-boton";

type Props = { titulo?: string; excluirSlug?: string; compacto?: boolean };

type TarjetaProducto = {
  key: string;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  productoId: string;
  esProteina: boolean;
  esNuevo: boolean;
};

function precioCLP(value: number) {
  return `$${value.toLocaleString("es-CL")}`;
}

/**
 * El catálogo muestra cuatro presentaciones comprables.
 * Vainilla y chocolate comparten una única ficha de proteína, con el sabor
 * precargado por URL; sus IDs individuales se mantienen para carrito/checkout.
 */
function obtenerTarjetas(excluirSlug?: string): TarjetaProducto[] {
  return catalogoProductos.flatMap((grupo) => {
    if (grupo.slug === excluirSlug) return [];

    return grupo.productoIds.flatMap((id) => {
      const producto = getProducto(id);
      if (!producto) return [];

      const nombre = id === "proteina-vainilla"
        ? "Proteína Vainilla 1,5 kg"
        : id === "proteina-chocolate"
          ? "Proteína Chocolate 1,5 kg"
          : producto.nombre;

      return [{
        key: id,
        slug: grupo.slug,
        nombre,
        imagen: producto.imagen,
        precio: producto.precio,
        productoId: producto.id,
        esProteina: grupo.slug === "proteina",
        esNuevo: grupo.slug !== "proteina",
      }];
    });
  });
}

export default function Productos({ titulo = "NUESTROS PRODUCTOS", excluirSlug, compacto = false }: Props) {
  const lista = obtenerTarjetas(excluirSlug);
  const Heading = compacto ? "h2" : "h1";

  return (
    <section id="productos" className={`relative bg-black text-white ${compacto ? "py-12 sm:py-16" : "py-14 sm:py-20 lg:py-24"}`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-3 text-[9px] font-medium tracking-[0.28em] text-[#EBD6A8]/80">PHANTOM PROTEIN</p>
          <Heading className="text-2xl font-bold uppercase tracking-[-0.03em] text-[#F5F3EE] sm:text-3xl md:text-4xl">{titulo}</Heading>
        </div>

        <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 ${compacto ? "md:grid-cols-3 lg:grid-cols-3" : "md:grid-cols-4"}`}>
          {lista.map((item) => {
            const href = item.esProteina
              ? `/productos/proteina?variante=${encodeURIComponent(item.productoId)}`
              : `/productos/${item.slug}`;

            return (
              <article key={item.key} className="group flex min-w-0 flex-col">
                <Link href={href} aria-label={`Ver ${item.nombre}`} className="relative block overflow-hidden bg-[#050505] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBD6A8]">
                  {item.esNuevo && <span className="absolute left-2 top-2 z-10 bg-[#EBD6A8] px-2 py-1 text-[7px] tracking-[0.16em] text-[#16140F] sm:left-3 sm:top-3 sm:px-3 sm:text-[8px]">NUEVO</span>}
                  <div className="relative h-[170px] sm:h-[225px] md:h-[245px] lg:h-[280px]">
                    <Image src={item.imagen} alt={item.nombre} fill quality={92} sizes="(max-width: 639px) 45vw, (max-width: 1023px) 42vw, 300px" className="object-contain p-3 transition duration-500 ease-out group-hover:scale-[1.045] sm:p-5" />
                  </div>
                </Link>
                <div className="mt-3 flex flex-1 flex-col px-0.5 sm:px-1">
                  <Link href={href} className="text-[10px] leading-4 text-white/90 transition hover:text-[#EBD6A8] sm:text-[12px] sm:leading-5">{item.nombre}</Link>
                  <p className="mt-1 text-[11px] font-semibold text-[#F2E8D3] sm:text-[12px]">{precioCLP(item.precio)}</p>
                  {item.esProteina && <p className="mt-1 text-[9px] text-white/45 sm:text-[10px]">25 g de proteína por porción</p>}
                  <div className="mt-auto pt-3 sm:pt-4">
                    {item.esProteina ? (
                      <Link href={href} className="flex min-h-9 items-center justify-center rounded-full border border-white/25 px-2 py-2 text-center text-[8px] font-semibold tracking-[0.1em] text-white transition hover:border-[#EBD6A8] hover:bg-[#EBD6A8] hover:text-black sm:min-h-10 sm:px-4 sm:text-[9px] sm:tracking-[0.16em]">ELEGIR SABOR</Link>
                    ) : (
                      <div className="[&>button]:min-h-9 [&>button]:px-2 [&>button]:text-[8px] sm:[&>button]:min-h-10 sm:[&>button]:px-4 sm:[&>button]:text-[9px]">
                        <AgregarCarritoBoton producto={getProducto(item.productoId)!} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!compacto && <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-white/10 pt-7 text-[8px] tracking-wide text-white/55 sm:mt-14 sm:gap-x-10 sm:text-[10px]">
          <span className="flex items-center gap-2"><span className="text-[#EBD6A8]">△</span> Alto valor biológico</span>
          <span className="flex items-center gap-2"><span className="text-[#EBD6A8]">⊘</span> Sin azúcar añadida</span>
          <span className="flex items-center gap-2"><span className="text-[#EBD6A8]">◇</span> Rendimiento real</span>
        </div>}
      </div>
    </section>
  );
}
