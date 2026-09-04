import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Phantom Protein">
      <span className="text-2xl tracking-wide text-white [font-family:var(--font-lacquer)]">
        PHANTOM
      </span>
    </Link>
  );
}
