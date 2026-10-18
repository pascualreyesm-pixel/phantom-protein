"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type Modo = "ingresar" | "crear";

export default function CuentaAuth() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("ingresar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const client = getSupabaseBrowser();
      void client.auth.getSession().then(({ data }) => {
        if (data.session) router.replace("/mi-cuenta");
      });
    } catch {
      // El aviso de configuración se mostrará cuando el visitante intente autenticarse.
    }
  }, [router]);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      const supabase = getSupabaseBrowser();
      const correo = email.trim().toLowerCase();

      if (modo === "ingresar") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: correo,
          password,
        });
        if (authError) throw authError;
        router.push("/mi-cuenta");
        router.refresh();
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: correo,
        password,
        options: {
          data: { nombre: nombre.trim() },
          emailRedirectTo: `${window.location.origin}/cuenta`,
        },
      });
      if (authError) throw authError;

      if (data.session) {
        router.push("/mi-cuenta");
        router.refresh();
      } else {
        setMensaje(
          "Cuenta creada. Revisa tu correo y confirma la dirección antes de iniciar sesión y consultar pedidos. Usa el mismo correo con el que compraste."
        );
        setModo("ingresar");
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No pudimos completar la solicitud. Inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[520px] px-4 py-14 text-white sm:py-20">
      <p className="text-center text-[9px] font-semibold tracking-[0.3em] text-[#EBD6A8]">
        PHANTOM PROTEIN
      </p>
      <h1 className="mt-3 text-center text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
        {modo === "ingresar" ? "Tu cuenta" : "Crear cuenta"}
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-white/60">
        Inicia sesión para consultar tus pedidos y abrir el seguimiento de tus envíos Starken.
      </p>

      <div className="mt-8 grid grid-cols-2 border-b border-white/15">
        <button type="button" onClick={() => { setModo("ingresar"); setMensaje(""); setError(""); }} className={`border-b-2 py-3 text-xs font-semibold tracking-widest transition ${modo === "ingresar" ? "border-[#EBD6A8] text-[#EBD6A8]" : "border-transparent text-white/50 hover:text-white"}`}>
          INICIAR SESIÓN
        </button>
        <button type="button" onClick={() => { setModo("crear"); setMensaje(""); setError(""); }} className={`border-b-2 py-3 text-xs font-semibold tracking-widest transition ${modo === "crear" ? "border-[#EBD6A8] text-[#EBD6A8]" : "border-transparent text-white/50 hover:text-white"}`}>
          REGISTRARSE
        </button>
      </div>

      <form onSubmit={enviar} className="mt-7 space-y-5">
        {modo === "crear" && (
          <label className="block text-xs text-white/70">
            Nombre (opcional)
            <input value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" maxLength={100} className="mt-2 w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#EBD6A8]" placeholder="Tu nombre" />
          </label>
        )}
        <label className="block text-xs text-white/70">
          Correo electrónico
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength={254} className="mt-2 w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#EBD6A8]" placeholder="tu@correo.cl" />
        </label>
        <label className="block text-xs text-white/70">
          Contraseña
          <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={modo === "crear" ? "new-password" : "current-password"} className="mt-2 w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#EBD6A8]" placeholder="Mínimo 8 caracteres" />
        </label>

        {mensaje && <p role="status" className="border border-emerald-900/70 bg-emerald-950/30 p-3 text-xs leading-5 text-emerald-200">{mensaje}</p>}
        {error && <p role="alert" className="border border-red-900/70 bg-red-950/30 p-3 text-xs leading-5 text-red-200">{error}</p>}

        <button type="submit" disabled={cargando} className="w-full rounded-full bg-[#F2E8D3] px-6 py-3.5 text-xs font-bold tracking-[0.15em] text-[#171511] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          {cargando ? "UN MOMENTO…" : modo === "ingresar" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
        </button>
      </form>

      <p className="mt-6 text-center text-[11px] leading-5 text-white/45">
        Para ver compras anteriores, registra una cuenta y confirma el mismo correo que usaste en el checkout. Las compras como invitado siguen disponibles aunque no tengas cuenta.
      </p>
      <div className="mt-6 text-center">
        <Link href="/productos" className="text-[10px] font-semibold tracking-widest text-[#EBD6A8] hover:text-white">SEGUIR COMPRANDO →</Link>
      </div>
    </section>
  );
}
