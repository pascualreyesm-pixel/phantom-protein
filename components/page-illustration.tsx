import Image from "next/image";
import LogoMark from "@/public/images/phantom/logo-mark.png";

export default function PageIllustration() {
  return (
    <>
      {/* Marca de fondo — sutil, aporta profundidad sin distraer */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 -z-10 opacity-[0.05]"
        aria-hidden="true"
      >
        <Image
          src={LogoMark}
          alt=""
          className="w-[850px] max-w-none"
          priority
        />
      </div>

      {/* Glows dorados ambientales */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 ml-[580px] -translate-x-1/2 -z-10"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-yellow-500/20 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[420px] ml-[380px] -translate-x-1/2 -z-10"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-yellow-600/10 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[640px] -ml-[300px] -translate-x-1/2 -z-10"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-yellow-500/10 blur-[160px]" />
      </div>
    </>
  );
}
