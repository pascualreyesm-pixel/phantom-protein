import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <PageIllustration />

      <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="z-10 max-w-2xl">

          <span
            data-aos="fade-down"
            className="mb-6 inline-block rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-sm tracking-widest text-white"
          >
            PODER BIOLÓGICO REAL
          </span>

          <div data-aos="fade-up" data-aos-delay="100" className="mb-6 w-full max-w-3xl">
            <Image
              src="/images/phantom/hero-wordmark.png"
              alt="Phantom Protein"
              width={1179}
              height={568}
              priority
              className="w-full"
            />
          </div>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mb-10 max-w-xl text-lg leading-8 text-gray-300"
          >
            25 g de proteína de clara de huevo por porción. Sin azúcar
            añadida, sin sellos. Rendimiento de verdad.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-wrap gap-5"
          >
            <a
              href="/productos"
              className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
            >
              Comprar Ahora
            </a>

            <a
              href="#marca"
              className="rounded-full border border-white/20 px-8 py-4 text-center text-white transition hover:scale-105 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Conocer Phantom
            </a>
          </div>
        </div>

        <div
          data-aos="fade-left"
          data-aos-delay="200"
          className="relative hidden flex-1 items-center justify-center lg:flex"
        >
          <Image
            src="/images/phantom/hero-producto-remolino.png"
            alt="Phantom Protein Chocolate"
            width={950}
            height={846}
            priority
            className="relative z-10 w-full max-w-2xl object-contain transition duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}
