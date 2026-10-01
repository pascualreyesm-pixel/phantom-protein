"use client";

import { useEffect, useState } from "react";
import Logo from "./logo";
import CarritoDrawer from "@/components/carrito-drawer";
import { useCarrito } from "@/lib/carrito-context";

const links = [
  { href: "/productos", label: "Productos" },
  { href: "/#novedades", label: "Novedades" },
  { href: "/#marca", label: "Marca" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const { cantidadTotal } = useCarrito();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled || open
            ? "border-b border-white/10 bg-black/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            <Logo />

            <nav className="hidden items-center gap-8 md:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 transition hover:text-[#D4AF37]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCarritoAbierto(true)}
                aria-label="Abrir carrito"
                className="relative text-white transition hover:text-[#D4AF37]"
              >
                🛒
                {cantidadTotal > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[11px] font-semibold text-black">
                    {cantidadTotal}
                  </span>
                )}
              </button>

              <a
                href="/productos"
                className="hidden rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:bg-gray-200 md:block"
              >
                Comprar Ahora
              </a>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Abrir menú"
                aria-expanded={open}
                className="flex h-10 w-10 items-center justify-center text-white md:hidden"
              >
                <span className="relative block h-4 w-6">
                  <span
                    className={`absolute left-0 top-0 h-0.5 w-6 bg-white transition-transform ${
                      open ? "translate-y-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[7px] h-0.5 w-6 bg-white transition-opacity ${
                      open ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[14px] h-0.5 w-6 bg-white transition-transform ${
                      open ? "-translate-y-[7px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {open && (
            <nav className="flex flex-col gap-1 border-t border-white/10 pb-6 pt-4 md:hidden">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base text-gray-200 transition hover:bg-white/5 hover:text-[#D4AF37]"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="/productos"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Comprar Ahora
              </a>
            </nav>
          )}
        </div>
      </header>

      <CarritoDrawer
        abierto={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
      />
    </>
  );
}
