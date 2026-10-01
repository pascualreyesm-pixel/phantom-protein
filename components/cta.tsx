import Image from "next/image";
import LogoMark from "@/public/images/phantom/logo-mark.png";

export default function Cta() {
  return (
    <section className="relative overflow-hidden bg-black py-14 sm:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        aria-hidden="true"
      >
        <Image src={LogoMark} alt="" className="w-[400px] max-w-none sm:w-[600px]" />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-44 w-[360px] rounded-full bg-[#D4AF37]/10 blur-[100px] sm:h-56 sm:w-[480px] sm:blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2
          data-aos="fade-up"
          className="mb-6 text-2xl leading-tight tracking-wide text-white sm:mb-8 sm:text-3xl md:text-5xl [font-family:var(--font-lacquer)]"
        >
          RENDIMIENTO REAL.
          <br />
          SIN ATAJOS.
        </h2>

        <a
          data-aos="fade-up"
          data-aos-delay="150"
          href="/productos"
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:scale-105 hover:bg-gray-200 sm:px-10 sm:py-4 sm:text-base"
        >
          Comprar Ahora
        </a>
      </div>
    </section>
  );
}