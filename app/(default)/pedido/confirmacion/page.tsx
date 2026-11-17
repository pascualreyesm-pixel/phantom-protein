"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCarrito } from "@/lib/carrito-context";

type EstadoPedido = {
  numero: string;
  estado: string;
  pago: string | null;
  aprobado: boolean;
};

function ConfirmacionContenido() {
  const searchParams = useSearchParams();
  const { vaciar } = useCarrito();
  const numero = searchParams.get("numero") || "";
  const [estado, setEstado] = useState<EstadoPedido | null>(null);
  const [consultando, setConsultando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!numero) {
      setConsultando(false);
      setError(true);
      return;
    }

    let activo = true;
    let intentos = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const consultar = async () => {
      try {
        const response = await fetch(`/api/pedido/estado?numero=${encodeURIComponent(numero)}`, { cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo consultar el pedido.");
        const data = (await response.json()) as EstadoPedido;
        if (!activo) return;
        setEstado(data);
        setError(false);
        if (data.aprobado) {
          vaciar();
          setConsultando(false);
          if (timer) clearInterval(timer);
          return;
        }
        intentos += 1;
        if (intentos >= 8) {
          setConsultando(false);
          if (timer) clearInterval(timer);
        }
      } catch {
        if (!activo) return;
        setError(true);
        intentos += 1;
        if (intentos >= 8) {
          setConsultando(false);
          if (timer) clearInterval(timer);
        }
      }
    };

    void consultar();
    timer = setInterval(() => void consultar(), 4000);
    return () => {
      activo = false;
      if (timer) clearInterval(timer);
    };
  }, [numero, vaciar]);

  const aprobado = Boolean(estado?.aprobado);
  const rechazado = estado?.pago === "rejected" || estado?.pago === "cancelled";

  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-2xl">
          {aprobado ? "✓" : rechazado ? "!" : "…"}
        </div>
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">PHANTOM PROTEIN</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {aprobado ? "Pago confirmado" : rechazado ? "Pago no aprobado" : consultando ? "Verificando tu pago" : "Pedido pendiente de confirmación"}
        </h1>
        {numero && <p className="mt-4 text-gray-400">Pedido <span className="font-semibold text-white">{numero}</span></p>}
        <p className="mx-auto mt-6 max-w-md leading-7 text-gray-300">
          {aprobado
            ? "Mercado Pago confirmó el pago. Tu pedido quedó registrado y estamos preparando el despacho."
            : rechazado
              ? "El pago no fue aprobado. Puedes volver al checkout e intentarlo nuevamente."
              : consultando
                ? "Estamos consultando el estado directamente en nuestros registros. Esto puede tardar unos segundos. No vuelvas a pagar mientras verificamos."
                : error
                  ? "No pudimos consultar el estado en este momento. Tu pedido no se marcará como pagado hasta recibir confirmación válida de Mercado Pago."
                  : "Todavía no recibimos la confirmación del pago. Si pagaste, espera unos minutos y vuelve a consultar; no necesitas ingresar tus datos otra vez."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/productos" className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200">Volver a productos</Link>
          {!aprobado && <Link href="/checkout" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]">Volver al checkout</Link>}
        </div>
      </div>
    </main>
  );
}

function CargandoConfirmacion() {
  return <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white"><div className="text-center"><p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">PHANTOM PROTEIN</p><p className="mt-4 text-gray-400">Cargando confirmación...</p></div></main>;
}

export default function ConfirmacionPedido() {
  return <Suspense fallback={<CargandoConfirmacion />}><ConfirmacionContenido /></Suspense>;
}
