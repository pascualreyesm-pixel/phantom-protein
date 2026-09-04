import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm space-y-4">
            <Logo />
            <p className="text-sm leading-6 text-gray-400">
              Proteína, creatina y colágeno de alta biodisponibilidad,
              diseñados para quienes buscan rendimiento real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Productos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/productos" className="transition hover:text-[#D4AF37]">Proteína Vainilla</a></li>
                <li><a href="/productos" className="transition hover:text-[#D4AF37]">Proteína Chocolate</a></li>
                <li><a href="/productos" className="transition hover:text-[#D4AF37]">Creatina</a></li>
                <li><a href="/productos" className="transition hover:text-[#D4AF37]">Colágeno Açaí</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Marca</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/#marca" className="transition hover:text-[#D4AF37]">Sobre la marca</a></li>
                <li><a href="/#novedades" className="transition hover:text-[#D4AF37]">Novedades</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Phantom Protein. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
