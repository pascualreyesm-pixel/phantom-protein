"use client";

import { useState } from "react";
import type { Producto } from "@/lib/productos";
import { useCarrito } from "@/lib/carrito-context";

export default function AgregarCarritoBoton({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  function onClick() {
    agregar(producto, 1);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <button type="button" onClick={onClick} className="flex min-h-10 w-full items-center justify-center rounded-full border border-white/25 px-4 py-3 text-center text-[9px] font-semibold tracking-[0.16em] text-white transition hover:border-[#EBD6A8] hover:bg-[#EBD6A8] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBD6A8]">
      {agregado ? "AÑADIDO ✓" : "AÑADIR AL CARRITO"}
    </button>
  );
}
