import Image from "next/image";
import Link from "next/link";

const pilares = [
  {
    numero: "01",
    titulo: "POTENCIA",
    texto: "Una línea de suplementos para acompañar tus objetivos y tu rutina de entrenamiento.",
  },
  {
    numero: "02",
    titulo: "DISCIPLINA",
    texto: "La constancia se construye día a día. Phantom te acompaña en el proceso.",
  },
  {
    numero: "03",
    titulo: "SIN ATAJOS",
    texto: "Información clara, productos definidos y una experiencia de compra sencilla.",
  },
];

export default function PorQuePhantom() {
  return (
    <section
      id="por-que-phantom"
      aria-labelledby="por-que-phantom-titulo"
      className="scroll-mt-28 border-y border-white/[0.07] bg-[#080808] text-white"
    >
      <div className="mx-auto grid max-w-[1380px] gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
        <div className="relative min-h-[300px] overflow-hidden bg-black sm:min-h-[440px] lg:min-h-[560px]">
          <Image
            src="/images/phantom/hero-modelos.webp"
            alt="Modelos con productos y ropa Phantom Protein"
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <p className="absolute bottom-5 left-5 text-[9px] font-semibold tracking-[0.3em] text-[#F2E8D3] sm:bottom-7 sm:left-7">
            PHANTOM PROTEIN · RENDIMIENTO REAL
          </p>
        </div>

        <div className="lg:py-4">
          <p className="mb-4 text-[9px] font-semibold tracking-[0.28em] text-[#EBD6A8]">
            MÁS QUE SUPLEMENTOS
          </p>
          <h2
            id="por-que-phantom-titulo"
            className="max-w-[650px] text-[clamp(2.2rem,5vw,4.3rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.045em] text-[#F6F4EF]"
          >
            ¿POR QUÉ <span className="text-[#EBD6A8]">PHANTOM?</span>
          </h2>
          <p className="mt-5 max-w-[570px] text-sm leading-7 text-white/65 sm:text-base">
            Creemos en el trabajo constante, en conocer lo que eliges y en avanzar con intención. Por eso reunimos una línea que incluye proteína de clara de huevo, creatina monohidrato y colágeno + açaí, con una experiencia de compra clara y directa.
          </p>

          <div className="mt-8 border-t border-white/10">
            {pilares.map((pilar) => (
              <div key={pilar.numero} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/10 py-4 sm:grid-cols-[44px_1fr] sm:gap-4 sm:py-5">
                <span className="pt-0.5 text-[10px] tracking-[0.16em] text-[#EBD6A8]/70">{pilar.numero}</span>
                <div>
                  <h3 className="text-xs font-bold tracking-[0.17em] text-[#F2E8D3] sm:text-sm">{pilar.titulo}</h3>
                  <p className="mt-1.5 max-w-[510px] text-xs leading-6 text-white/55 sm:text-sm">{pilar.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/productos"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F2E8D3] px-7 py-3 text-[10px] font-bold tracking-[0.15em] text-[#171511] transition hover:bg-white"
            >
              VER PRODUCTOS
            </Link>
            <Link
              href="/objetivos"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-7 py-3 text-[10px] font-semibold tracking-[0.15em] text-white transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]"
            >
              COMPRA POR OBJETIVO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
