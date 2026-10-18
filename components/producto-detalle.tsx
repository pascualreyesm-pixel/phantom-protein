"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { catalogoProductos, getProducto, type GrupoProducto } from "@/lib/catalogo";
import { useCarrito } from "@/lib/carrito-context";
import Productos from "@/components/productos";

function precioCLP(value: number) { return `$${value.toLocaleString("es-CL")}`; }

export default function ProductoDetalle({ slug, varianteInicial }: { slug: string; varianteInicial?: string }) {
  const grupo = catalogoProductos.find((item) => item.slug === slug) as GrupoProducto | undefined;
  const varianteValida = grupo?.productoIds.includes(varianteInicial ?? "") ? varianteInicial : grupo?.productoIds[0];
  const [varianteId, setVarianteId] = useState(varianteValida ?? "");
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { agregar } = useCarrito();

  const productoActual = useMemo(() => getProducto(varianteId) ?? (grupo ? getProducto(grupo.productoIds[0]) : undefined), [varianteId, grupo]);
  const imagenes = useMemo(() => {
    if (!grupo) return [];

    const imagenPrincipal = productoActual?.imagen ?? grupo.imagen;
    const galeriaOriginal = grupo.galeriaExtra;

    if (grupo.slug !== "proteina") {
      return [imagenPrincipal, ...galeriaOriginal];
    }

    const fotosPorSabor = varianteId === "proteina-chocolate"
      ? [
          "/images/phantom/proteina-chocolate-modelo.webp",
          "/images/phantom/proteina-chocolate-piedras.webp",
          "/images/phantom/tabla-nutricional-chocolate.png",
        ]
      : [
          "/images/phantom/proteina-vainilla-modelo.webp",
          "/images/phantom/tabla-nutricional-vainilla.png",
        ];

    return [imagenPrincipal, ...galeriaOriginal, ...fotosPorSabor];
  }, [grupo, productoActual?.imagen, varianteId]);

  if (!grupo || !productoActual) return null;
  const imagenSeleccionada = imagenes[imagenActiva] ?? imagenes[0];
  const esTablaNutricional = imagenSeleccionada.includes("tabla-nutricional-");
  const saborSeleccionado = varianteId === "proteina-chocolate" ? "chocolate" : "vainilla";
  const altImagenSeleccionada = esTablaNutricional
    ? `Tabla nutricional de la proteína sabor ${saborSeleccionado}, con ${saborSeleccionado === "chocolate" ? "25,2" : "25,1"} gramos de proteína por porción`
    : `${grupo.nombre}${grupo.slug === "proteina" ? ` sabor ${saborSeleccionado}` : ""}`;

  function seleccionarVariante(id: string) {
    setVarianteId(id);
    setImagenActiva(0);
  }

  function anadir() {
    if (!productoActual) return;
    agregar(productoActual, cantidad);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  }

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-[1320px] px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12 lg:pt-12">
        <nav aria-label="Ruta de navegación" className="mb-6 text-[9px] tracking-[0.12em] text-white/40 sm:mb-8"><Link href="/" className="transition hover:text-[#EBD6A8]">INICIO</Link><span className="mx-2">/</span><Link href="/productos" className="transition hover:text-[#EBD6A8]">PRODUCTOS</Link><span className="mx-2">/</span><span className="text-white/75">{grupo.nombre.toUpperCase()}</span></nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(350px,0.9fr)] lg:gap-14 xl:gap-20">
          <div className="grid min-w-0 gap-3 sm:grid-cols-[66px_minmax(0,1fr)] sm:gap-5">
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
              {imagenes.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setImagenActiva(index)} aria-label={`Ver imagen ${index + 1} de ${grupo.nombre}`} aria-pressed={imagenActiva === index} className={`relative h-[66px] w-[66px] shrink-0 border bg-[#070707] transition sm:h-[66px] sm:w-[66px] ${imagenActiva === index ? "border-[#EBD6A8]" : "border-white/15 hover:border-white/50"}`}><Image src={src} alt="" fill quality={90} sizes="66px" className="object-contain p-1" /></button>)}
            </div>
            <div className={`order-1 relative overflow-hidden bg-[#030303] sm:order-2 ${esTablaNutricional ? "min-h-[420px] aspect-[0.80/1] sm:min-h-[540px] sm:aspect-[0.82/1] lg:aspect-auto" : "min-h-[300px] aspect-square sm:min-h-0 sm:aspect-[0.92/1] lg:aspect-[0.9/1]"}`}>
              <Image key={imagenSeleccionada} src={imagenSeleccionada} alt={altImagenSeleccionada} fill quality={esTablaNutricional ? 100 : 98} priority sizes="(max-width: 640px) 95vw, (max-width: 1024px) 55vw, 540px" className={esTablaNutricional ? "object-contain p-2 sm:p-4" : imagenActiva === 0 ? "object-contain p-8 sm:p-10" : "object-cover"} />
            </div>
          </div>

          <div className="flex flex-col lg:pt-5">
            <p className="text-[9px] font-medium tracking-[0.24em] text-[#EBD6A8]/75">PRODUCTO DESTACADO</p>
            <h1 className="mt-4 max-w-[570px] text-3xl font-extrabold uppercase leading-[0.98] tracking-[-0.04em] text-[#F5F3EE] sm:text-4xl lg:text-5xl">{grupo.nombre}</h1>
            <p className="mt-3 text-[9px] tracking-[0.18em] text-white/45">{grupo.etiqueta}</p>
            <p className="mt-5 text-xl font-semibold text-[#EBD6A8]">{precioCLP(productoActual.precio)}</p>

            {grupo.variantes && <div className="mt-6"><p className="mb-3 text-[9px] font-medium tracking-[0.18em] text-white/45">SABOR</p><div className="flex flex-wrap gap-2">{grupo.variantes.map((variante) => <button key={variante.id} type="button" onClick={() => seleccionarVariante(variante.id)} aria-pressed={varianteId === variante.id} className={`min-h-9 rounded-full border px-5 py-2 text-[10px] transition ${varianteId === variante.id ? "border-[#F0E5CF] bg-[#F0E5CF] text-[#171511]" : "border-white/25 bg-transparent text-white hover:border-[#EBD6A8]"}`}>{variante.etiqueta}</button>)}</div></div>}

            <p className="mt-6 max-w-[560px] text-sm leading-6 text-white/65">{productoActual.descripcion}</p>
            <ul className="mt-5 space-y-2 text-[11px] leading-5 text-white/65">{productoActual.detalles.map((detalle) => <li key={detalle} className="flex gap-2"><span className="text-[#EBD6A8]">•</span><span>{detalle}</span></li>)}</ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center border border-white/20"><button type="button" onClick={() => setCantidad((v) => Math.max(1, v - 1))} aria-label="Reducir cantidad" className="h-12 w-11 text-lg text-white/70 transition hover:text-[#EBD6A8]">−</button><span className="w-8 text-center text-xs tabular-nums">{cantidad}</span><button type="button" onClick={() => setCantidad((v) => Math.min(20, v + 1))} aria-label="Aumentar cantidad" className="h-12 w-11 text-lg text-white/70 transition hover:text-[#EBD6A8]">+</button></div>
              <button type="button" onClick={anadir} className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#EBD6A8] px-5 py-3 text-[9px] font-bold tracking-[0.16em] text-[#191710] transition hover:bg-white sm:text-[10px]">{agregado ? "AÑADIDO AL CARRITO ✓" : "AÑADIR AL CARRITO"}</button>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-white/40">Envíos a todo Chile. Los costos y las condiciones de despacho se confirman durante el checkout.</p>
            <a href="#productos-relacionados" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-white/25 pb-2 text-[9px] tracking-[0.16em] text-white/65 transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]">VER PRODUCTOS RELACIONADOS <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
      <div id="productos-relacionados" className="scroll-mt-28 border-t border-white/10"><Productos titulo="TAMBIÉN TE PUEDE INTERESAR" excluirSlug={grupo.slug} compacto /></div>
    </div>
  );
}
