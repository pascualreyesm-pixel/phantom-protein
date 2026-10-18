# Botón interactivo «POR QUÉ PHANTOM»

Este parche conecta el botón «POR QUÉ PHANTOM» de la tercera diapositiva a una sección de marca dedicada en Inicio. También conecta la opción «MARCA» del menú de escritorio y del menú móvil con esa misma sección.

## Archivos incluidos
- `components/hero-home.tsx`: actualiza el destino del botón del carrusel.
- `components/ui/header.tsx`: actualiza los enlaces «MARCA» del menú.
- `components/por-que-phantom.tsx`: nueva sección de marca responsive.
- `app/(default)/page.tsx`: inserta la sección de marca en Inicio sin retirar la sección «¿Por qué clara de huevo?».
- `public/images/phantom/hero-modelos.webp`: imagen que utiliza la sección de marca.

## Instalación
Extrae el ZIP y combina su contenido en la raíz de `phantom-protein-new`, reemplazando solo los archivos coincidentes. No reemplaces `.env.local`, `.git`, `node_modules` ni `.next`.

Después ejecuta `corepack pnpm dev` y prueba el botón «POR QUÉ PHANTOM» en la tercera diapositiva. Debe llevar a la sección titulada «¿POR QUÉ PHANTOM?» en la página de inicio. La sección «¿POR QUÉ CLARA DE HUEVO?» permanece debajo como contenido separado.
