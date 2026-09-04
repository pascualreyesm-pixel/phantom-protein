"use client";

import Link from "next/link";
import { useCarrito } from "@/lib/carrito-context";

const dorado =
  "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] bg-clip-text text-transparent";

export default function CarritoDrawer({
  abierto,
  onClose,
}: {
  abierto: boolean;
  onClose: () => void;
}) {
  const { items, subtotal, actualizarCantidad, quitar } = useCarrito();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-black transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-lg text-white [font-family:var(--font-anton)]">
            TU CARRITO
          </h2>
          <button onClick={onClose} aria-label="Cerrar carrito" className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {items.length === 0 && (
            <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.imagen} alt={item.nombre} className="h-12 w-12 object-contain" />
              <div className="flex-1">
                <p className="text-sm text-white">{item.nombre}</p>
                <p className={`text-xs font-semibold ${dorado}`}>${item.precio.toLocaleString("es-CL")}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="h-6 w-6 rounded-full border border-white/20 text-xs text-white hover:border-[#D4AF37]"
                >
                  −
                </button>
                <span className="w-4 text-center text-xs text-white">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="h-6 w-6 rounded-full border border-white/20 text-xs text-white hover:border-[#D4AF37]"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => quitar(item.id)}
                aria-label={`Quitar ${item.nombre}`}
                className="text-gray-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-4 flex justify-between text-white">
              <span>Subtotal</span>
              <span className={`font-semibold ${dorado}`}>${subtotal.toLocaleString("es-CL")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-white px-6 py-3 text-center font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
            >
              Ir a pagar
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
