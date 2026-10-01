"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { productos } from "@/lib/productos";
import { useCarrito } from "@/lib/carrito-context";

const dorado =
  "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] bg-clip-text text-transparent";

export default function Productos() {
  const [activo, setActivo] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [interactuo, setInteractuo] = useState(false);
  const [agregado, setAgregado] = useState(false);

  const startX = useRef(0);
  const startRotate = useRef(0);
  const producto = productos[activo];
  const { agregar } = useCarrito();

  function cambiar(delta: number) {
    setActivo((prev) => (prev + delta + productos.length) % productos.length);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(true);
    setInteractuo(true);
    startX.current = e.clientX;
    startRotate.current = rotateY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragging) {
      const delta = e.clientX - startX.current;
      setRotateY(Math.max(-50, Math.min(50, startRotate.current + delta * 0.5)));
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateX(py * -10);
      setRotateY(px * 10);
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;

    const delta = e.clientX - startX.current;

    if (Math.abs(delta) > 70) {
      cambiar(delta < 0 ? 1 : -1);
    }

    setDragging(false);
    setRotateY(0);
    setRotateX(0);
  }

  function onPointerLeave() {
    if (dragging) setDragging(false);
    setRotateY(0);
    setRotateX(0);
  }

  function agregarAlCarrito() {
    agregar(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <section
      id="productos"
      className="relative overflow-hidden bg-black py-14 sm:py-24"
    >
      <style>{`
        @keyframes phantomFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes phantomIn {
          from { opacity: 0; transform: scale(0.9) translateY(14px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .phantom-float { animation: phantomFloat 4.5s ease-in-out infinite; }
        .phantom-in { animation: phantomIn 0.45s ease-out; }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div data-aos="fade-up" className="mb-10 text-center sm:mb-16">
          <span className="mb-3 hidden rounded-full border border-[#D4AF37]/30 bg-white/5 px-3 py-1.5 text-[11px] tracking-widest text-white sm:mb-4 sm:px-4 sm:py-2 sm:text-sm md:inline-block">
            CATÁLOGO
          </span>

          <h2 className="text-3xl text-white sm:text-4xl md:text-5xl [font-family:var(--font-anton)]">
            NUESTROS <span className={dorado}>PRODUCTOS</span>
          </h2>
        </div>

        <div
          data-aos="fade-up"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") cambiar(1);
            if (e.key === "ArrowLeft") cambiar(-1);
          }}
          className="relative mb-2 flex h-[270px] cursor-grab touch-none select-none items-center justify-center rounded-3xl outline-none [perspective:1200px] sm:mb-4 sm:h-[340px] md:h-[420px]"
        >
          <div className="absolute h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-[80px] sm:h-72 sm:w-72 sm:blur-[100px]" />

          <button
            onClick={() => cambiar(-1)}
            aria-label="Producto anterior"
            className="absolute left-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:left-2 sm:h-10 sm:w-10 md:left-4"
          >
            ‹
          </button>

          <button
            onClick={() => cambiar(1)}
            aria-label="Siguiente producto"
            className="absolute right-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:right-2 sm:h-10 sm:w-10 md:right-4"
          >
            ›
          </button>

          <div className="phantom-float relative z-10 h-full w-full">
            <div
              key={activo}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: dragging ? "none" : "transform 0.4s ease-out",
              }}
              className="phantom-in relative h-full w-full [transform-style:preserve-3d]"
            >
              <Image
                src={producto.imagen}
                alt={`Phantom ${producto.nombre}`}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 400px"
                className="object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                priority
              />
            </div>
          </div>

          {!interactuo && (
            <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-gray-500 sm:bottom-2 sm:text-xs">
              Arrastra para girar
            </span>
          )}
        </div>

        <div
          key={`info-${activo}`}
          className="phantom-in mb-6 text-center sm:mb-8"
        >
          <span
            className={`mb-1.5 block text-[11px] font-semibold uppercase tracking-wider sm:mb-2 sm:text-xs ${dorado}`}
          >
            {producto.categoria}
          </span>

          <h3 className="mb-1 text-2xl text-white sm:text-3xl [font-family:var(--font-anton)]">
            {producto.nombre}
          </h3>

          <p
            className={`mb-3 text-base font-semibold sm:mb-4 sm:text-lg ${dorado}`}
          >
            ${producto.precio.toLocaleString("es-CL")}
          </p>

          <ul className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-gray-400 sm:mb-6 sm:gap-x-6 sm:text-sm">
            {producto.detalles.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <button
            onClick={agregarAlCarrito}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:bg-gray-200 sm:px-8 sm:text-base"
          >
            {agregado ? "Añadido ✓" : "Agregar al carrito"}
          </button>
        </div>

        <div className="flex justify-center gap-3 overflow-x-auto pb-1 sm:gap-4 sm:pb-2">
          {productos.map((p, i) => (
            <button
              key={p.nombre}
              onClick={() => setActivo(i)}
              aria-label={`Ver ${p.nombre}`}
              className={`group flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border p-2.5 transition-all duration-300 sm:h-24 sm:w-24 sm:p-3 ${
                i === activo
                  ? "scale-105 border-[#D4AF37] bg-white/5 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/30"
              }`}
            >
              <Image
                src={p.imagen}
                alt=""
                width={60}
                height={60}
                className="h-full w-full object-contain opacity-80 transition group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}