import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Marca */}
          <div className="max-w-sm space-y-4">
            <Logo />

            <p className="text-sm leading-6 text-gray-400">
              Proteína, creatina y colágeno de alta biodisponibilidad,
              diseñados para quienes buscan rendimiento real.
            </p>
          </div>

          {/* Links */}
          <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 md:w-auto">
            {/* Productos */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Productos
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="/productos"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Proteína Vainilla
                  </a>
                </li>

                <li>
                  <a
                    href="/productos"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Proteína Chocolate
                  </a>
                </li>

                <li>
                  <a
                    href="/productos"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Creatina
                  </a>
                </li>

                <li>
                  <a
                    href="/productos"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Colágeno Açaí
                  </a>
                </li>
              </ul>
            </div>

            {/* Marca */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Marca
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="/#marca"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Sobre la marca
                  </a>
                </li>

                <li>
                  <a
                    href="/#novedades"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Novedades
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Contáctate
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://wa.me/56947376830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[#D4AF37]"
                  >
                    WhatsApp
                  </a>
                </li>

                <li>
                  <a
                    href="https://instagram.com/phantom.protein"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[#D4AF37]"
                  >
                    Instagram
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:pascualreyesm@gmail.com"
                    className="break-all transition hover:text-[#D4AF37]"
                  >
                    Correo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Phantom Protein. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}