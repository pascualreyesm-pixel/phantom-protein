import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex min-w-[112px] flex-col items-center justify-center leading-none"
      aria-label="Phantom Protein, inicio"
    >
      <span className="text-[1.35rem] tracking-[-0.045em] text-white [font-family:var(--font-lacquer)] sm:text-[1.55rem]">
        PHANTOM
      </span>
      <span className="mt-1 text-[0.62rem] tracking-[0.19em] text-[#EBD7AE] [font-family:var(--font-lacquer)] sm:text-[0.7rem]">
        PROTEIN
      </span>
    </Link>
  );
}
