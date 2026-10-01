"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCarrito } from "@/lib/carrito-context";

function ConfirmacionContenido() {
  const searchParams = useSearchParams();
  const { vaciar } = useCarrito();

  const numero = searchParams.get("numero");
  const status = searchParams.get("status") || "";

  const aprobado = status === "approved";
  const pendiente = status === "pending";
  const rechazado = status === "rejected" || status === "failure";

  useEffect(() => {
    if (aprobado) {
      vaciar();
    }
  }, [aprobado, vaciar]);

  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-2xl">
          {aprobado ? "✓" : pendiente ? "…" : rechazado ? "!" : "•"}
        </div>

        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">
          PHANTOM PROTEIN
        </p>

        <h1 className="text-3xl font-semibold sm:text-4xl">
          {aprobado
            ? "Pago recibido"
            : pendiente
              ? "Pago en proceso"
              : rechazado
                ? "Pago no aprobado"
                : "Pedido recibido"}
        </h1>

        {numero && (
          <p className="mt-4 text-gray-400">
            Pedido{" "}
            <span className="font-semibold text-white">{numero}</span>
          </p>
        )}

        <p className="mx-auto mt-6 max-w-md leading-7 text-gray-300">
          {aprobado
            ? "Mercado Pago informó una aprobación. Estamos registrando la confirmación del pago y preparando la información del pedido."
            : pendiente
              ? "Mercado Pago está procesando el pago. No necesitas volver a completar tus datos."
              : rechazado
                ? "El pago no quedó aprobado. Puedes volver al checkout e intentarlo nuevamente."
                : "El proceso del pedido fue recibido. Revisa tu correo y el estado del pago."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/productos"
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Volver a productos
          </Link>

          {(rechazado || !aprobado) && (
            <Link
              href="/checkout"
              className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Volver al checkout
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function CargandoConfirmacion() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">
          PHANTOM PROTEIN
        </p>
        <p className="mt-4 text-gray-400">Cargando confirmación...</p>
      </div>
    </main>
  );
}

export default function ConfirmacionPedido() {
  return (
    <Suspense fallback={<CargandoConfirmacion />}>
      <ConfirmacionContenido />
    </Suspense>
  );
}