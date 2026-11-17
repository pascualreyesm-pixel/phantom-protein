import Link from "next/link";

export default function BlackFridayBanner() {
  return (
    <section aria-labelledby="black-friday-title" className="bg-black px-4 py-8 text-white sm:px-8 sm:py-12 lg:px-12">
      <div className="relative mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 overflow-hidden border border-[#EBD6A8]/30 bg-[radial-gradient(ellipse_at_top,rgba(235,214,168,0.12),transparent_62%),#080808] px-5 py-9 text-center sm:px-10 sm:py-12 lg:flex-row lg:text-left">
        <div className="absolute inset-y-0 left-0 w-1 bg-[#EBD6A8]" />
        <div className="relative">
          <p className="mb-3 text-[9px] font-semibold tracking-[0.3em] text-[#EBD6A8]">PHANTOM PROTEIN · OFERTA ESPECIAL</p>
          <h2 id="black-friday-title" className="text-3xl font-black uppercase leading-none tracking-[-0.04em] text-[#F6F4EE] sm:text-4xl lg:text-5xl">BLACK FRIDAY <span className="text-[#EBD6A8]">ADELANTADO</span></h2>
          <p className="mt-4 text-xs leading-6 text-white/60 sm:text-sm">15% de descuento en productos elegibles usando <strong className="text-[#EBD6A8]">BLACKPHANTOM15</strong>. No aplica a creatina ni al pack proteína + creatina.</p>
        </div>
        <Link href="/productos" className="relative inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#EBD6A8] px-8 py-3 text-[9px] font-bold tracking-[0.16em] text-[#191710] transition hover:bg-white">APROVECHAR OFERTA</Link>
      </div>
    </section>
  );
}
