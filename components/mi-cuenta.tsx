"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type PedidoCuenta = {
  numero_pedido: string;
  estado: string;
  total: number;
  created_at: string;
  starken_numero_envio: string | null;
};

const etiquetasEstado: Record<string, string> = {
  pendiente_de_pago: "Pendiente de pago",
  pagado: "Pago confirmado",
  preparando: "En preparación",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function pesos(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function fecha(value: string) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(value));
}

export default function MiCuenta() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [pedidos, setPedidos] = useState<PedidoCuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const supabase = getSupabaseBrowser();
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const session = data.session;
        if (!session) {
          router.replace("/cuenta");
          return;
        }
        if (activo) setCorreo(session.user.email ?? "");
        if (!session.user.email_confirmed_at) {
          if (activo) setMensaje("Confirma tu correo electrónico desde el mensaje que te enviamos para poder consultar pedidos.");
          return;
        }

        const response = await fetch("/api/cuenta/pedidos", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: "no-store",
        });
        const body = (await response.json()) as { pedidos?: PedidoCuenta[]; error?: string };
        if (!response.ok) throw new Error(body.error || "No pudimos cargar tus pedidos.");
        if (activo) setPedidos(body.pedidos ?? []);
      } catch (cause) {
        if (activo) setError(cause instanceof Error ? cause.message : "No pudimos cargar tu cuenta.");
      } finally {
        if (activo) setCargando(false);
      }
    }
    void cargar();
    return () => { activo = false; };
  }, [router]);

  async function salir() {
    try {
      await getSupabaseBrowser().auth.signOut();
    } finally {
      router.replace("/cuenta");
      router.refresh();
    }
  }

  return (
    <section className="mx-auto min-h-[65vh] max-w-[1100px] px-4 py-12 text-white sm:px-8 sm:py-16 lg:px-12">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#EBD6A8]">PHANTOM PROTEIN</p>
          <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Mis pedidos</h1>
          {correo && <p className="mt-2 text-sm text-white/55">Sesión iniciada como {correo}</p>}
        </div>
        <button type="button" onClick={() => void salir()} className="self-start border border-white/20 px-5 py-2.5 text-[10px] font-semibold tracking-widest transition hover:border-[#EBD6A8] hover:text-[#EBD6A8] sm:self-auto">CERRAR SESIÓN</button>
      </div>

      {cargando && <p className="py-10 text-sm text-white/55">Cargando tus pedidos…</p>}
      {error && <p role="alert" className="mt-7 border border-red-900/70 bg-red-950/30 p-4 text-sm text-red-200">{error}<span className="mt-2 block text-xs">Comprueba que la migración de seguimiento se haya ejecutado en Supabase.</span></p>}
      {!cargando && mensaje && <p role="status" className="mt-7 border border-[#EBD6A8]/20 bg-white/[0.03] p-4 text-sm leading-6 text-white/75">{mensaje}</p>}
      {!cargando && !mensaje && !error && pedidos.length === 0 && (
        <div className="py-12">
          <h2 className="text-xl font-bold">Todavía no encontramos pedidos</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Para consultar una compra anterior, la cuenta debe usar el mismo correo que ingresaste al realizar el pedido. Si acabas de comprar, el registro puede tardar unos momentos.</p>
          <Link href="/productos" className="mt-6 inline-flex rounded-full bg-[#F2E8D3] px-6 py-3 text-[10px] font-bold tracking-widest text-black hover:bg-white">VER PRODUCTOS</Link>
        </div>
      )}

      <div className="mt-7 space-y-4">
        {pedidos.map((pedido) => (
          <article key={pedido.numero_pedido} className="border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[9px] tracking-[0.22em] text-[#EBD6A8]">PEDIDO</p>
                <h2 className="mt-1 text-lg font-bold">{pedido.numero_pedido}</h2>
                <p className="mt-1 text-xs text-white/45">Realizado el {fecha(pedido.created_at)}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm font-bold text-[#F2E8D3]">{pesos(pedido.total)}</p>
                <p className="mt-1 text-xs text-white/55">{etiquetasEstado[pedido.estado] ?? pedido.estado}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-white/70">SEGUIMIENTO STARKEN</p>
                {pedido.starken_numero_envio ? (
                  <p className="mt-1 text-xs text-white/55">Orden de flete: <span className="text-white">{pedido.starken_numero_envio}</span></p>
                ) : (
                  <p className="mt-1 text-xs text-white/45">El número de seguimiento aparecerá cuando el pedido sea despachado.</p>
                )}
              </div>
              {pedido.starken_numero_envio && <a href={`https://www.starken.cl/seguimiento?codigo=${encodeURIComponent(pedido.starken_numero_envio)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#EBD6A8]/60 px-5 py-2 text-[9px] font-bold tracking-widest text-[#EBD6A8] transition hover:bg-[#EBD6A8] hover:text-black">RASTREAR ENVÍO ↗</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
