"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Logo from "./logo";
import CarritoDrawer from "@/components/carrito-drawer";
import { useCarrito } from "@/lib/carrito-context";
import { catalogoProductos } from "@/lib/catalogo";

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.65"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.5 4.5" strokeLinecap="round"/></svg>;
}
function UserIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.65"><circle cx="12" cy="7.5" r="3.3"/><path d="M5.2 20c.6-3.5 3.1-5.3 6.8-5.3s6.2 1.8 6.8 5.3" strokeLinecap="round"/></svg>;
}
function BagIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.65"><path d="M5 8.5h14l-1 12H6z" strokeLinejoin="round"/><path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" strokeLinecap="round"/></svg>;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cantidadTotal } = useCarrito();
  const resultados = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("es-CL");
    if (!clean) return catalogoProductos;
    return catalogoProductos.filter((p) =>
      `${p.nombre} ${p.etiqueta} ${p.descripcion}`.toLocaleLowerCase("es-CL").includes(clean)
    );
  }, [query]);

  function closePanels() {
    setMobileOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <div className="flex h-[28px] items-center justify-center bg-[#EBD6A8] px-3 text-center text-[8px] font-semibold tracking-[0.2em] text-[#27231C] sm:h-[31px] sm:text-[10px] sm:tracking-[0.25em]">
        ENVÍOS A TODO CHILE <span className="mx-2">·</span> SIN AZÚCAR AÑADIDA <span className="mx-2">·</span> SIN SELLOS
      </div>
      <div className="border-b border-white/10 bg-black">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-4 sm:h-[76px] sm:px-8 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex xl:gap-10" aria-label="Navegación principal">
            <div className="group relative flex h-[76px] items-center">
              <Link href="/productos" className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-white/85 transition hover:text-[#EBD6A8] xl:text-[11px]">
                SUPLEMENTOS <span aria-hidden="true" className="text-xs">⌄</span>
              </Link>
              <div className="invisible absolute left-0 top-[calc(100%-1px)] min-w-56 translate-y-2 border border-white/10 bg-[#0a0a0a] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {catalogoProductos.map((p) => <Link key={p.slug} href={`/productos/${p.slug}`} className="block px-4 py-3 text-xs tracking-wide text-white/75 transition hover:bg-white/5 hover:text-[#EBD6A8]">{p.nombre}</Link>)}
              </div>
            </div>
            <div className="group relative flex h-[76px] items-center">
              <Link href="/objetivos" className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-white/85 transition hover:text-[#EBD6A8] xl:text-[11px]">
                COMPRA POR OBJETIVO <span aria-hidden="true" className="text-xs">⌄</span>
              </Link>
              <div className="invisible absolute left-0 top-[calc(100%-1px)] min-w-64 translate-y-2 border border-white/10 bg-[#0a0a0a] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {catalogoProductos.map((p) => <Link key={p.slug} href={`/objetivos#objetivo-${p.slug}`} className="block px-4 py-3 text-xs tracking-wide text-white/75 transition hover:bg-white/5 hover:text-[#EBD6A8]">{p.objetivo}</Link>)}
              </div>
            </div>
            <Link href="/#por-que-phantom" className="text-[10px] font-medium tracking-[0.16em] text-white/85 transition hover:text-[#EBD6A8] xl:text-[11px]">MARCA</Link>
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <button type="button" aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar productos"} aria-expanded={searchOpen} onClick={() => { setSearchOpen((v) => !v); }} className="transition hover:text-[#EBD6A8]"><SearchIcon /></button>
            <Link href="/cuenta" aria-label="Iniciar sesión o crear cuenta" className="transition hover:text-[#EBD6A8]">
              <UserIcon />
            </Link>
            <button type="button" aria-label={`Abrir carrito, ${cantidadTotal} artículos`} onClick={() => setCartOpen(true)} className="relative transition hover:text-[#EBD6A8]"><BagIcon />{cantidadTotal > 0 && <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#EBD6A8] px-1 text-[9px] font-bold text-black">{cantidadTotal}</span>}</button>
            <button type="button" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)} className="flex h-9 w-8 flex-col items-center justify-center gap-[5px] lg:hidden">
              <span className={`h-px w-5 bg-white transition-transform ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-px w-5 bg-white transition-transform ${mobileOpen ? "-translate-y-[9px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {searchOpen && <div className="absolute left-0 right-0 top-full z-40 border-b border-white/10 bg-[#080808] px-4 py-5 shadow-2xl sm:px-8"><div className="mx-auto max-w-3xl"><label htmlFor="phantom-search" className="mb-2 block text-[10px] tracking-[0.2em] text-white/50">BUSCAR EN PHANTOM PROTEIN</label><input id="phantom-search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca proteína, creatina, colágeno..." className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#EBD6A8] focus:ring-0" /><div className="mt-3 grid gap-1 sm:grid-cols-3">{resultados.map((p) => <Link key={p.slug} href={`/productos/${p.slug}`} onClick={closePanels} className="px-3 py-3 text-xs text-white/75 transition hover:bg-white/5 hover:text-[#EBD6A8]">{p.nombre}<span className="mt-1 block text-[10px] text-white/40">{p.etiqueta}</span></Link>)}{resultados.length === 0 && <p className="py-4 text-xs text-white/50">No encontramos productos con ese término.</p>}</div></div></div>}

      {mobileOpen && <div className="border-b border-white/10 bg-[#080808] px-4 pb-5 pt-3 lg:hidden"><nav className="flex flex-col" aria-label="Menú móvil"><Link href="/productos" onClick={closePanels} className="border-b border-white/10 py-4 text-xs tracking-[0.16em]">SUPLEMENTOS</Link><Link href="/objetivos" onClick={closePanels} className="border-b border-white/10 py-4 text-xs tracking-[0.16em]">COMPRA POR OBJETIVO</Link><Link href="/#por-que-phantom" onClick={closePanels} className="border-b border-white/10 py-4 text-xs tracking-[0.16em]">MARCA</Link><a href="https://wa.me/56947376830" onClick={closePanels} target="_blank" rel="noopener noreferrer" className="py-4 text-xs tracking-[0.16em] text-[#EBD6A8]">INFORMACIÓN Y AYUDA ↗</a></nav></div>}

      <CarritoDrawer abierto={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
