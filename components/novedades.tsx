"use client";

import { useRef, useState } from "react";

const slides = [
  { tag: "NUEVO", titulo: "Colágeno Açaí ya disponible", texto: "Sabor açaí, uso diario, fácil de mezclar." },
  { tag: "NUEVO", titulo: "Creatina sin sabor", texto: "Alta pureza. Se mezcla con cualquier líquido sin alterar el sabor." },
  { tag: "MARCA", titulo: "Sin sellos", texto: "Toda la línea Phantom está formulada sin azúcar añadida." },
  { tag: "ENVÍOS", titulo: "A todo Chile", texto: "Despacho disponible a lo largo de todo el país." },
];

export default function Novedades() {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);

  function go(delta: number) {
    setIndex((prev) => (prev + delta + slides.length) % slides.length);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  }

  function onPointerUp() {
    if (dragOffset < -60) go(1);
    else if (dragOffset > 60) go(-1);
    setDragging(false);
    setDragOffset(0);
  }

  return (
    <section id="novedades" className="relative bg-black py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="relative h-64 cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-500/10 via-black to-black active:cursor-grabbing md:h-72"
        >
          {slides.map((s, i) => (
            <div
              key={s.titulo}
              style={{
                transform: `translateX(${(i - index) * 100 + (dragging ? dragOffset / 6 : 0)}%)`,
                transition: dragging ? "none" : "transform 0.5s ease",
              }}
              className="absolute inset-0 flex flex-col items-start justify-center px-10"
            >
              <span className="mb-4 inline-block rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-yellow-400">
                {s.tag}
              </span>
              <h3 className="mb-2 max-w-md text-2xl text-white md:text-3xl [font-family:var(--font-anton)]">
                {s.titulo}
              </h3>
              <p className="max-w-md text-sm text-gray-400 md:text-base">
                {s.texto}
              </p>
            </div>
          ))}

          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            ›
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.titulo}
              onClick={() => setIndex(i)}
              aria-label={`Ir a ${s.titulo}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-yellow-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
