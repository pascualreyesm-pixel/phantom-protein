import Image from "next/image";
import LogoMark from "@/public/images/phantom/logo-mark.png";

export default function Cta() {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        aria-hidden="true"
      >
        <Image src={LogoMark} alt="" className="w-[600px] max-w-none" />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-56 w-[480px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2
          data-aos="fade-up"
          className="mb-8 text-3xl tracking-wide text-white md:text-5xl [font-family:var(--font-lacquer)]"
        >
          RENDIMIENTO REAL.
          <br />
          SIN ATAJOS.
        </h2>
        <a
          data-aos="fade-up"
          data-aos-delay="150"
          href="/productos"
          className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
        >
          Comprar Ahora
        </a>
      </div>
    </section>
  );
}
