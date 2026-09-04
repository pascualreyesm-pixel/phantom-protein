import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <span className="mb-6 text-8xl text-yellow-400 [font-family:var(--font-anton)]">
        404
      </span>
      <h1 className="mb-4 text-2xl text-white [font-family:var(--font-anton)] md:text-3xl">
        ESTA PÁGINA SE DESVANECIÓ
      </h1>
      <p className="mb-8 max-w-md text-gray-400">
        El enlace que buscas no existe o fue movido. Vuelve al inicio para
        seguir explorando Phantom Protein.
      </p>
      <Link
        href="/"
        className="rounded-full bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-yellow-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
