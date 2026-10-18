"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DURACION_SLIDE = 6500;
const slides = [
  { id: "rendimiento", nombre: "Rendimiento de verdad", tipo: "rendimiento" as const },
  { id: "modelos", nombre: "Phantom Protein en movimiento", tipo: "modelos" as const },
  { id: "conoce", nombre: "Conoce Phantom Protein", tipo: "conoce" as const },
];

function Flecha({ direccion }: { direccion: "izquierda" | "derecha" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={direccion === "izquierda" ? "M19 12H5m7 7-7-7 7-7" : "M5 12h14m-7-7 7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function HeroHome() {
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [movimientoReducido, setMovimientoReducido] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMovimientoReducido(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (pausado || movimientoReducido) return;
    const timer = window.setInterval(() => setActivo((prev) => (prev + 1) % slides.length), DURACION_SLIDE);
    return () => window.clearInterval(timer);
  }, [pausado, movimientoReducido]);

  function cambiar(delta: number) {
    setActivo((prev) => (prev + delta + slides.length) % slides.length);
  }

  return (
    <section aria-label="Presentación de Phantom Protein" className="relative isolate overflow-hidden bg-black text-white">
      <div className="relative h-[min(690px,calc(100svh-96px))] min-h-[535px] sm:min-h-[580px] lg:min-h-[590px]">
        {slides.map((slide, index) => (
          <div key={slide.id} aria-hidden={activo !== index} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activo === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}>
            {slide.tipo === "rendimiento" && <>
              <div className="absolute inset-0 bg-[#030303]" />
              <div className="absolute inset-y-0 right-[-18%] w-[125%] sm:right-[-7%] sm:w-[88%] lg:right-[-2%] lg:w-[72%]">
                <Image src="/images/phantom/hero-producto-remolino.png" alt="Envase Phantom Protein rodeado de partículas" fill quality={100} priority={index === 0} sizes="(max-width: 640px) 125vw, (max-width: 1024px) 88vw, 75vw" className="object-contain object-center opacity-85 sm:object-right" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent sm:via-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center px-5 pb-8 pt-4 sm:px-10 lg:px-16">
                <div className="max-w-[610px] -translate-y-2 sm:w-[54%] lg:w-[48%]">
                  <p className="mb-5 text-[9px] font-medium tracking-[0.26em] text-[#EBD6A8] sm:text-[10px]">SUPLEMENTOS DEPORTIVOS</p>
                  <h1 className="max-w-[590px] text-[clamp(2.75rem,7vw,6.1rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-[#F6F4EE] [font-family:var(--font-inter)]">RENDIMIENTO<br />DE<br />VERDAD.</h1>
                  <p className="mt-5 max-w-[380px] text-[11px] leading-5 text-white/75 sm:text-sm sm:leading-6">Proteína de clara de huevo con 25 g por porción. Sin azúcar añadida. Sin sellos.</p>
                  <Link href="/productos" className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-[#F2E8D3] px-6 py-3 text-[9px] font-bold tracking-[0.15em] text-[#171511] transition hover:bg-white sm:mt-7 sm:px-7 sm:text-[10px]">VER PRODUCTOS</Link>
                </div>
              </div>
            </>}

            {slide.tipo === "modelos" && <>
              <Image src="/images/phantom/hero-modelos.webp" alt="Modelos mostrando productos y ropa Phantom Protein" fill quality={98} sizes="100vw" className="object-cover object-[center_42%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
            </>}

            {slide.tipo === "conoce" && <>
              <div className="absolute inset-0 bg-black" />
              <div className="absolute inset-0 flex items-center justify-center px-1 sm:px-6">
                <div className="relative h-full w-full max-w-[710px]">
                  <Image src="/images/phantom/hero-conoce.webp" alt="Conoce Phantom Protein: proteína, creatina y colágeno" fill quality={93} sizes="(max-width: 640px) 100vw, 700px" className="object-contain" />
                  <div className="absolute bottom-[3.5%] left-1/2 z-20 -translate-x-1/2">
                    <Link href="/#por-que-phantom" className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-[#F2E8D3] px-6 py-3 text-[9px] font-bold tracking-[0.14em] text-[#15130F] shadow-xl transition hover:bg-white sm:px-7 sm:text-[10px]">POR QUÉ PHANTOM</Link>
                  </div>
                </div>
              </div>
            </>}
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-4 z-20 mx-auto flex max-w-[1500px] items-center justify-between px-5 sm:bottom-6 sm:px-10 lg:px-16">
          <div className={`flex items-center gap-2 ${activo === 1 ? "text-black/80" : "text-white/80"}`}>
            {slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setActivo(index)} aria-label={`Ir a diapositiva ${index + 1}: ${slide.nombre}`} aria-current={activo === index} className={`h-[3px] transition-all duration-300 ${activo === index ? "w-9 bg-[#EBD6A8]" : "w-4 bg-current/50 hover:bg-current"}`} />)}
          </div>
          <div className="flex items-center gap-2 text-white">
            <button type="button" onClick={() => cambiar(-1)} aria-label="Imagen anterior" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]"><Flecha direccion="izquierda" /></button>
            <button type="button" onClick={() => cambiar(1)} aria-label="Imagen siguiente" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]"><Flecha direccion="derecha" /></button>
            <button type="button" onClick={() => setPausado((v) => !v)} aria-label={pausado ? "Reanudar carrusel automático" : "Pausar carrusel automático"} aria-pressed={pausado} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-[11px] transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]">{pausado ? "▶" : "Ⅱ"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
