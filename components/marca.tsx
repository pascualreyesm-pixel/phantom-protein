const caracteristicas = [
  { valor: "25g", texto: "Proteína por porción" },
  { valor: "0g", texto: "Azúcar añadida" },
  { valor: "100%", texto: "Sin sellos" },
  { valor: "Alta", texto: "Biodisponibilidad" },
];

export default function Marca() {
  return (
    <section id="marca" className="relative overflow-hidden bg-black py-14 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[160px]" />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span
          data-aos="fade-up"
          className="mb-3 inline-block rounded-full border border-[#D4AF37]/30 bg-white/5 px-3 py-1.5 text-[11px] tracking-widest text-white sm:mb-4 sm:px-4 sm:py-2 sm:text-sm"
        >
          SOBRE LA MARCA
        </span>

        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="mb-5 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-4xl md:text-5xl"
        >
          LA PROTEÍNA DE MAYOR PODER BIOLÓGICO
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="150"
          className="mx-auto mb-9 max-w-2xl text-sm leading-6 text-gray-300 sm:mb-14 sm:text-lg sm:leading-8"
        >
          Proteína de clara de huevo deshidratada y pasteurizada, con alto
          valor biológico y textura fina de mezcla uniforme. Formulada para
          quienes buscan rendimiento real, sin azúcar añadida y sin sellos.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
          {caracteristicas.map((c, i) => (
            <div
              key={c.texto}
              data-aos="fade-up"
              data-aos-delay={200 + i * 80}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-2.5 py-5 transition hover:border-[#D4AF37]/40 sm:rounded-2xl sm:px-4 sm:py-8"
            >
              <div className="mb-1.5 text-2xl text-white sm:mb-2 sm:text-3xl [font-family:var(--font-anton)]">
                {c.valor}
              </div>

              <div className="text-xs leading-4 text-gray-400 sm:text-sm">
                {c.texto}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}