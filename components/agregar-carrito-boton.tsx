"use client";

import { useState } from "react";
import { Producto } from "@/lib/productos";
import { useCarrito } from "@/lib/carrito-context";

export default function AgregarCarritoBoton({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  function onClick() {
    agregar(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <button
      onClick={onClick}
      className="mt-auto rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
    >
      {agregado ? "Añadido ✓" : "Agregar al carrito"}
    </button>
  );
}
