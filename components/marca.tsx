import Image from "next/image";
import Link from "next/link";

const datos = [
  { valor: "25 G", texto: "Proteína por porción" },
  { valor: "0 G", texto: "Azúcar añadida" },
  { valor: "ALTA", texto: "Biodisponibilidad" },
  { valor: "FINA", texto: "Textura de mezcla uniforme" },
];

export default function Marca() {
  return (
    <section id="marca" className="scroll-mt-28 bg-black text-white">
      <div className="relative h-[190px] overflow-hidden sm:h-[280px] lg:h-[360px]">
        <Image src="/images/phantom/banner-adn.webp" alt="Imagen conceptual de una estructura molecular iluminada en rojo y dorado" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50" />
      </div>

      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-24">
        <div className="relative aspect-[1/0.86] min-h-[260px] overflow-hidden bg-[#080808] sm:min-h-[350px]">
          <Image src="/images/phantom/escena-proteina.webp" alt="Envase Phantom Protein bajo una iluminación cálida" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>

        <div className="lg:py-4">
          <p className="mb-4 text-[9px] font-medium tracking-[0.26em] text-[#EBD6A8]">LA FÓRMULA</p>
          <h2 className="max-w-[580px] text-3xl font-extrabold uppercase leading-[0.98] tracking-[-0.035em] text-[#F6F4EF] sm:text-4xl lg:text-5xl">¿POR QUÉ CLARA<br className="hidden sm:block" /> DE HUEVO?</h2>
          <p className="mt-5 max-w-[580px] text-sm leading-6 text-white/65 sm:text-[15px] sm:leading-7">Proteína de clara de huevo deshidratada y pasteurizada, formulada para quienes buscan rendimiento real. Una alternativa para sumar proteína a tu rutina, con información clara sobre su contenido por porción.</p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
            {datos.map((dato) => <div key={dato.texto} className="border border-white/10 px-4 py-4 sm:px-5 sm:py-5"><p className="text-2xl font-extrabold tracking-tight text-[#EBD6A8] sm:text-3xl">{dato.valor}</p><p className="mt-1.5 text-[10px] leading-4 text-white/55 sm:text-xs">{dato.texto}</p></div>)}
          </div>

          <div className="mt-7 flex items-center gap-5 border-t border-white/10 pt-6 sm:gap-8">
            <div className="flex h-[92px] w-[108px] items-center justify-center sm:h-[122px] sm:w-[138px]">
              <Image src="/images/phantom/sello-haccp.webp" alt="Sello HACCP" width={316} height={306} quality={95} className="h-full w-full object-contain" />
            </div>
          </div>
          <Link href="/productos/proteina" className="mt-7 inline-flex items-center gap-3 border-b border-white/25 pb-2 text-[9px] font-semibold tracking-[0.18em] text-white transition hover:border-[#EBD6A8] hover:text-[#EBD6A8]">DESCUBRIR PHANTOM PROTEIN <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
