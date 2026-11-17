"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCarrito } from "@/lib/carrito-context";

type EstadoVista = "consultando" | "pagado" | "pendiente" | "rechazado" | "error";

function ConfirmacionContenido() {
  const searchParams = useSearchParams();
  const { vaciar } = useCarrito();
  const vaciarRef = useRef(vaciar);
  vaciarRef.current = vaciar;
  const numero = searchParams.get("numero") || "";
  const token = searchParams.get("token") || "";
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id") || "";
  const [estado, setEstado] = useState<EstadoVista>("consultando");

  useEffect(() => {
    if (!numero || !token) {
      setEstado("error");
      return;
    }
    let activo = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let intentos = 0;

    const consultar = async () => {
      intentos += 1;
      try {
        // El redirect de Mercado Pago incluye payment_id. Lo consultamos desde
        // nuestro servidor con el Access Token; nunca confiamos en status de la URL.
        if (paymentId) {
          const confirmacion = await fetch("/api/pedido/confirmar-pago", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numero, token, paymentId }),
            cache: "no-store",
          });
          const pago = await confirmacion.json();
          if (!activo) return;
          if (confirmacion.ok && pago.pagado === true) {
            setEstado("pagado");
            vaciarRef.current();
            return;
          }
          if (confirmacion.ok && pago.status === "rejected") {
            setEstado("rechazado");
            return;
          }
        }

        // El webhook puede llegar antes o después del redirect; consultamos Supabase
        // como fuente de verdad y dejamos varios intentos para dar tiempo al proceso.
        const response = await fetch(`/api/pedido/estado?numero=${encodeURIComponent(numero)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await response.json();
        if (!activo) return;
        if (response.ok && data.pagado === true) {
          vaciarRef.current();
          if (data.emailEnviado === true || !paymentId) {
            setEstado("pagado");
            return;
          }
        }
        if (!response.ok && response.status === 404) {
          setEstado("error");
          return;
        }
      } catch {
        // Se reintenta: Mercado Pago o el webhook pueden tardar unos segundos.
      }

      if (!activo) return;
      if (intentos >= 12) {
        setEstado("pendiente");
        return;
      }
      timeout = setTimeout(consultar, 2500);
    };

    void consultar();
    return () => {
      activo = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [numero, token, paymentId]);

  const titulo = estado === "pagado" ? "Pago confirmado" : estado === "rechazado" ? "Pago no aprobado" : estado === "error" ? "No pudimos consultar el pedido" : estado === "pendiente" ? "Pago en proceso" : "Confirmando tu pago";
  const mensaje = estado === "pagado"
    ? "Tu pago fue verificado en nuestro servidor. Phantom Protein recibió tu pedido y te enviaremos la información del despacho por correo."
    : estado === "rechazado"
      ? "Mercado Pago no informó un pago aprobado. Puedes volver al checkout e intentarlo nuevamente."
      : estado === "error"
        ? "No pudimos validar la referencia del pedido. Escríbenos para revisarlo antes de volver a pagar."
        : estado === "pendiente"
          ? "Tu pedido está registrado, pero todavía no vemos una aprobación de pago. No vuelvas a pagar por ahora; revisa tu correo o contáctanos si sigue igual."
          : "Estamos consultando el estado del pedido con nuestro servidor. No cierres esta página todavía.";

  return (
    <main className="min-h-[65vh] bg-black px-4 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-2xl text-[#EBD6A8]">{estado === "pagado" ? "✓" : estado === "rechazado" || estado === "error" ? "!" : "…"}</div>
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">PHANTOM PROTEIN</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{titulo}</h1>
        {numero && <p className="mt-4 text-sm text-gray-400">Pedido <span className="font-semibold text-white">{numero}</span></p>}
        <p className="mx-auto mt-6 max-w-md leading-7 text-gray-300">{mensaje}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/productos" className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200">Volver a productos</Link>
          {estado !== "pagado" && <Link href="/checkout" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]">Volver al checkout</Link>}
        </div>
      </div>
    </main>
  );
}

function CargandoConfirmacion() {
  return <main className="flex min-h-[65vh] items-center justify-center bg-black px-4 text-white"><div className="text-center"><p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37]">PHANTOM PROTEIN</p><p className="mt-4 text-gray-400">Cargando confirmación...</p></div></main>;
}

export default function ConfirmacionPedido() {
  return <Suspense fallback={<CargandoConfirmacion />}><ConfirmacionContenido /></Suspense>;
}
