"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ConfirmacionContenido() {
  const params = useSearchParams();
  const numero = params.get("numero");

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-yellow-500/30 bg-white/[0.02] p-10 text-center">
      <h1 className="mb-3 text-2xl text-white [font-family:var(--font-anton)]">
        PEDIDO RECIBIDO
      </h1>
      {numero && (
        <p className="mb-4 text-sm text-gray-500">
          N° de pedido: <span className="text-yellow-400">{numero}</span>
        </p>
      )}
      <p className="mb-8 text-gray-400">
        Tu pedido quedó <strong className="text-white">pendiente de pago</strong>.
        Te contactaremos por correo o WhatsApp para coordinar el pago y el
        despacho por Starken.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-yellow-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
