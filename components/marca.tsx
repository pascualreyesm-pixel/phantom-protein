const caracteristicas = [
  { valor: "25g", texto: "Proteína por porción" },
  { valor: "0g", texto: "Azúcar añadida" },
  { valor: "100%", texto: "Sin sellos" },
  { valor: "Alta", texto: "Biodisponibilidad" },
];

export default function Marca() {
  return (
    <section id="marca" className="relative overflow-hidden bg-black py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[160px]" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <span data-aos="fade-up" className="mb-4 inline-block rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-sm tracking-widest text-white">
          SOBRE LA MARCA
        </span>

        <h2 data-aos="fade-up" data-aos-delay="100" className="mb-6 text-4xl font-bold text-white md:text-5xl">
          LA PROTEÍNA DE MAYOR PODER BIOLÓGICO
        </h2>

        <p data-aos="fade-up" data-aos-delay="150" className="mx-auto mb-14 max-w-2xl text-lg leading-8 text-gray-300">
          Proteína de clara de huevo deshidratada y pasteurizada, con alto
          valor biológico y textura fina de mezcla uniforme. Formulada para
          quienes buscan rendimiento real, sin azúcar añadida y sin sellos.
        </p>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {caracteristicas.map((c, i) => (
            <div
              key={c.texto}
              data-aos="fade-up"
              data-aos-delay={200 + i * 80}
              className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-8 transition hover:border-[#D4AF37]/40"
            >
              <div className="mb-2 text-3xl text-white [font-family:var(--font-anton)]">{c.valor}</div>
              <div className="text-sm text-gray-400">{c.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
