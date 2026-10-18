import Image from "next/image";
import Link from "next/link";
import { catalogoProductos } from "@/lib/catalogo";

const palabras = ["POTENCIA", "DISCIPLINA", "SIN ATAJOS", "RENDIMIENTO REAL"];

export default function LineaObjetivos() {
  return (
    <div className="bg-black text-white">
      <section className="relative isolate h-[245px] overflow-hidden sm:h-[330px] lg:h-[390px]" aria-label="Conoce la línea Phantom Protein">
        <Image src="/images/phantom/banner-conocer-linea.webp" alt="Envases Phantom Protein alineados bajo una luz cálida" fill quality={92} sizes="100vw" className="object-cover object-[center_66%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-7 flex justify-center px-4 sm:bottom-10">
          <Link href="/productos" className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#F3E9D4] px-6 py-3 text-[9px] font-bold tracking-[0.14em] text-[#171511] transition hover:bg-white sm:px-8 sm:text-[10px]">CONOCER LA LÍNEA</Link>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 py-4 sm:py-5" aria-label="Potencia, disciplina, sin atajos, rendimiento real">
        <div className="phantom-marquee-track flex w-max items-center gap-7 whitespace-nowrap text-[18px] font-bold tracking-wide sm:gap-10 sm:text-[27px] lg:text-[30px]">
          {[0, 1].map((copy) => <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-7 sm:gap-10">
            {palabras.map((palabra, index) => <span key={palabra} className="flex items-center gap-7 sm:gap-10"><span className={index % 2 === 0 ? "text-[#EBD6A8]" : "text-white"}>{palabra}</span><span className="text-[11px] text-[#EBD6A8] sm:text-base">✦</span></span>)}
          </div>)}
        </div>
      </div>

      <section id="objetivos" className="scroll-mt-28 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
          <div className="mb-8 text-center sm:mb-12">
            <p className="mb-3 text-[9px] tracking-[0.25em] text-[#EBD6A8]/75">ENCUENTRA TU ENFOQUE</p>
            <h2 className="text-2xl font-bold uppercase tracking-[-0.035em] text-[#F5F3EE] sm:text-3xl md:text-4xl">COMPRA POR OBJETIVO</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 lg:gap-5">
            {catalogoProductos.map((producto) => (
              <Link key={producto.slug} id={`objetivo-${producto.slug}`} href={`/productos/${producto.slug}`} className="group relative isolate block aspect-[4/4.5] min-h-[270px] overflow-hidden bg-[#080808] sm:aspect-[4/5] sm:min-h-0">
                <Image src={producto.objetivoImagen} alt={producto.objetivoTexto} fill quality={92} sizes="(max-width: 640px) 94vw, (max-width: 1024px) 32vw, 420px" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-4 lg:p-6">
                  <p className="mb-2 text-[8px] font-medium tracking-[0.18em] text-[#EBD6A8]">{producto.objetivoTexto.toUpperCase()}</p>
                  <h3 className="max-w-[330px] text-xl font-extrabold uppercase leading-[1.02] tracking-[-0.025em] text-white sm:text-lg lg:text-2xl">{producto.objetivo}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-white/80 transition group-hover:text-[#EBD6A8]">EXPLORAR <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
