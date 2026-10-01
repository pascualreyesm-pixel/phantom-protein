"use client";

import { useState } from "react";
import { useCarrito } from "@/lib/carrito-context";
import { COSTO_ENVIO } from "@/lib/productos";

const REGIONES = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana de Santiago", "Libertador General Bernardo O'Higgins",
  "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo", "Magallanes y de la Antártica Chilena",
];

function rutValido(rut: string) {
  const limpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

export default function CheckoutForm() {
  const { items, subtotal, actualizarCantidad, quitar } = useCarrito();

  const [form, setForm] = useState({
    nombre: "", apellido: "", rut: "", email: "", telefono: "",
    direccion: "", numero: "", depto: "", comuna: "", region: REGIONES[6],
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const total = subtotal + COSTO_ENVIO;

  function set(campo: string, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevosErrores: Record<string, string> = {};
    const requeridos: (keyof typeof form)[] = [
      "nombre", "apellido", "rut", "email", "telefono",
      "direccion", "numero", "comuna", "region",
    ];

    requeridos.forEach((campo) => {
      if (!form[campo]?.trim()) nuevosErrores[campo] = "Campo obligatorio";
    });

    if (form.rut && !rutValido(form.rut)) nuevosErrores.rut = "RUT inválido";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nuevosErrores.email = "Correo inválido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setErrorGeneral("Tu carrito está vacío.");
      return;
    }
    if (!validar()) return;

    setEnviando(true);
    setErrorGeneral("");

    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
          cliente: form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar el pago.");

      if (data.redireccionar && data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Mercado Pago no devolvió una URL de pago.");
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo procesar tu pedido."
      );
      setEnviando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
        <p className="text-gray-400">Tu carrito está vacío.</p>
      </div>
    );
  }

  const campo = (
    name: keyof typeof form,
    label: string,
    opciones?: { type?: string }
  ) => (
    <div>
      <label className="mb-1.5 block text-sm text-gray-300">{label}</label>
      <input
        type={opciones?.type || "text"}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
      />
      {errores[name] && <p className="mt-1 text-sm text-red-400">{errores[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
      <div className="order-2 space-y-4 md:order-1">
        <h2 className="mb-2 text-xl text-white [font-family:var(--font-anton)]">RESUMEN</h2>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <img src={item.imagen} alt={item.nombre} className="h-14 w-14 object-contain" />
            <div className="flex-1">
              <p className="text-sm text-white">{item.nombre}</p>
              <p className="text-xs text-gray-500">${item.precio.toLocaleString("es-CL")} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="h-7 w-7 rounded-full border border-white/20 text-white hover:border-yellow-400">−</button>
              <span className="w-5 text-center text-white">{item.cantidad}</span>
              <button type="button" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="h-7 w-7 rounded-full border border-white/20 text-white hover:border-yellow-400">+</button>
            </div>
            <button type="button" onClick={() => quitar(item.id)} aria-label={`Quitar ${item.nombre}`} className="text-gray-500 transition hover:text-red-400">×</button>
          </div>
        ))}

        <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${subtotal.toLocaleString("es-CL")}</span></div>
          <div className="flex justify-between text-gray-400"><span>Envío</span><span>${COSTO_ENVIO.toLocaleString("es-CL")}</span></div>
          <div className="flex justify-between text-lg text-white [font-family:var(--font-anton)]">
            <span>Total</span>
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] bg-clip-text text-transparent">${total.toLocaleString("es-CL")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="order-1 space-y-4 md:order-2">
        <h2 className="mb-2 text-xl text-white [font-family:var(--font-anton)]">TUS DATOS</h2>
        <div className="grid grid-cols-2 gap-4">{campo("nombre", "Nombre")}{campo("apellido", "Apellido")}</div>
        {campo("rut", "RUT")}
        {campo("email", "Correo", { type: "email" })}
        {campo("telefono", "Teléfono")}
        {campo("direccion", "Dirección (calle)")}
        <div className="grid grid-cols-2 gap-4">{campo("numero", "Número")}{campo("depto", "Depto / Casa (opcional)")}</div>
        {campo("comuna", "Comuna")}
        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Región</label>
          <select value={form.region} onChange={(e) => set("region", e.target.value)} className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500">
            {REGIONES.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>
        </div>
        {errorGeneral && <p className="text-sm text-red-400">{errorGeneral}</p>}
        <button type="submit" disabled={enviando} className="w-full rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.01] hover:bg-gray-200 disabled:opacity-50">
          {enviando ? "Redirigiendo a Mercado Pago..." : "Continuar al pago"}
        </button>
      </form>
    </div>
  );
}
