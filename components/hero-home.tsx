import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

const dorado =
  "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C] bg-clip-text text-transparent";

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <PageIllustration />

      {/* =====================================================
          DESKTOP — FONDO
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center overflow-hidden sm:flex">
        <Image
          src="/images/phantom/hero-wordmark.png"
          alt=""
          width={1179}
          height={568}
          priority
          className="w-[110%] max-w-none opacity-[0.02] lg:w-[75%]"
        />
      </div>

      {/* =====================================================
          MÓVIL — PRODUCTO + PARTÍCULAS COMO FONDO
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 sm:hidden">
        <div className="absolute left-1/2 top-[35%] w-[150vw] -translate-x-1/2">
          <Image
            src="/images/phantom/hero-producto-remolino.png"
            alt=""
            width={950}
            height={846}
            priority
            sizes="150vw"
            className="w-full object-contain opacity-50"
          />
        </div>

        {/* Oscurecimiento general */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Mantiene la parte superior más limpia */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-black/30" />
      </div>

      {/* =====================================================
          CONTENIDO
      ====================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[100svh]
          max-w-7xl
          flex-col
          px-4
          pb-6
          pt-24
          sm:px-6
          sm:pb-16
          sm:pt-32
          lg:flex-row
          lg:items-center
          lg:gap-8
          lg:pb-0
          lg:pt-20
        "
      >
        {/* ===================================================
            CONTENIDO PRINCIPAL
        ==================================================== */}
        <div className="z-20 flex w-full max-w-lg flex-1 flex-col">
          {/* Branding */}
          <div
            data-aos="fade-down"
            className="mb-4 sm:mb-6"
          >
            <div
              className="
                text-[clamp(1.35rem,5vw,1.7rem)]
                leading-none
                tracking-wide
                text-white
                sm:text-3xl
                lg:text-4xl
              "
              style={{
                fontFamily: "var(--font-lacquer)",
              }}
            >
              PHANTOM
            </div>

            <div
              className="
                mt-1
                text-[clamp(0.72rem,2.8vw,0.85rem)]
                leading-none
                tracking-[0.18em]
                text-[#D4AF37]
                sm:text-base
                lg:text-lg
              "
              style={{
                fontFamily: "var(--font-lacquer)",
              }}
            >
              PROTEIN
            </div>
          </div>

          {/* Badge */}
          <span
            data-aos="fade-down"
            data-aos-delay="100"
            className="
              mb-[clamp(1.5rem,4vh,2.2rem)]
              inline-block
              w-fit
              rounded-full
              border
              border-[#D4AF37]/30
              bg-black/20
              px-2.5
              py-1
              text-[8px]
              tracking-[0.16em]
              text-gray-200
              sm:mb-16
              sm:px-4
              sm:py-2
              sm:text-[10px]
            "
          >
            PODER BIOLÓGICO REAL
          </span>

          {/* Título */}
          <h1
            data-aos="fade-up"
            data-aos-delay="150"
            className="
              mb-[clamp(0.8rem,2.5vh,1.2rem)]
              max-w-md
              text-[clamp(1.5rem,7vw,1.9rem)]
              font-semibold
              leading-[1.08]
              tracking-wide
              sm:mb-7
              sm:text-4xl
              lg:text-[3.15rem]
              [font-family:var(--font-lacquer)]
            "
          >
            <span className="block">
              Proteína de clara de huevo.
            </span>

            <span className={`mt-2 block sm:mt-4 ${dorado}`}>
              Rendimiento de verdad.
            </span>
          </h1>

          {/* Descripción */}
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="
              max-w-md
              text-center
              text-[clamp(0.72rem,3.2vw,0.82rem)]
              leading-5
              text-gray-200
              sm:mb-9
              sm:text-left
              sm:text-base
              sm:leading-7
            "
          >
            <span className="block sm:inline">
              25 g de proteína por porción.
            </span>

            <span className="block sm:ml-1 sm:inline">
              Sin azúcar añadida. Sin sellos.
            </span>

            <span className="mt-1 block text-gray-300 sm:mt-1">
              Diseñada para quienes prefieren el proceso.
            </span>
          </p>

          {/* =================================================
              BOTONES
          ================================================== */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="
              mt-auto
              flex
              w-full
              flex-col
              gap-2
              pt-[clamp(7rem,18svh,10rem)]
              sm:mt-0
              sm:flex-row
              sm:gap-4
              sm:pt-0
            "
          >
            <a
              href="/productos"
              className="
                w-full
                rounded-full
                bg-white
                px-6
                py-3
                text-center
                text-sm
                font-semibold
                text-black
                transition
                hover:scale-105
                hover:bg-gray-200
                sm:w-auto
                sm:px-8
                sm:py-3.5
              "
            >
              Comprar Ahora
            </a>

            <a
              href="#marca"
              className="
                w-full
                rounded-full
                border
                border-white/25
                bg-black/20
                px-6
                py-3
                text-center
                text-sm
                text-white
                transition
                hover:scale-105
                hover:border-[#D4AF37]
                hover:text-[#D4AF37]
                sm:w-auto
                sm:px-8
                sm:py-3.5
              "
            >
              Conocer Phantom
            </a>
          </div>
        </div>

        {/* ===================================================
            PRODUCTO — SOLO DESKTOP
        ==================================================== */}
        <div
          data-aos="fade-left"
          data-aos-delay="200"
          className="
            relative
            mt-8
            hidden
            w-full
            flex-1
            items-center
            justify-center
            sm:flex
            lg:mt-0
          "
        >
          <div className="absolute h-[220px] w-[220px] rounded-full bg-[#D4AF37]/10 blur-[70px] sm:h-[350px] sm:w-[350px] sm:blur-[80px]" />

          <Image
            src="/images/phantom/hero-producto-remolino.png"
            alt="Phantom Protein Chocolate"
            width={950}
            height={846}
            priority
            className="relative z-10 w-full max-w-lg object-contain lg:max-w-2xl"
          />
        </div>
      </div>
    </section>
  );
}