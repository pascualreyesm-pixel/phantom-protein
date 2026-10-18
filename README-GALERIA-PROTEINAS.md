# Phantom Protein — imágenes y galería por sabor

Este parche se aplica sobre la versión de rediseño que ya está instalada. Copia el contenido del ZIP en la raíz de `phantom-protein-new`, conserva la estructura de carpetas y acepta reemplazar los archivos coincidentes.

## Archivos actualizados
- `components/hero-home.tsx`: portada usa el nuevo `hero-producto-remolino.png`; se conserva el carrusel y el enlace «POR QUÉ PHANTOM».
- `components/producto-detalle.tsx`: agrega imágenes distintas por sabor, mantiene las fotos existentes y muestra las tablas nutricionales completas sin recortarlas.
- `lib/catalogo.ts`: la galería de producto usa el nuevo PNG de partículas.
- `lib/productos.ts`: texto distingue 25,1 g por porción para vainilla y 25,2 g para chocolate; IDs y precios se mantienen.

## Imágenes añadidas
- `hero-producto-remolino.png`: portada de partículas, PNG de 1600 × 1422.
- `hero-modelos.webp`: la foto original de ambos modelos, reexportada a alta calidad y ampliada por interpolación a 1920 px de ancho. El tamaño mayor reduce el reescalado visible, pero no crea detalles que no existían en la fuente.
- `proteina-chocolate-modelo.webp`: foto del modelo con el envase.
- `proteina-chocolate-piedras.webp`: producto sobre fondo de piedras.
- `tabla-nutricional-chocolate.png`: tabla con 25,2 g de proteína por porción.
- `proteina-vainilla-modelo.webp`: foto de la modelo con el envase.
- `tabla-nutricional-vainilla.png`: tabla con 25,1 g de proteína por porción.

## Instalación segura
1. Detén el servidor local (`Ctrl+C`).
2. Copia estas carpetas/archivos en la raíz del proyecto, combinando las carpetas y reemplazando solo archivos con el mismo nombre.
3. No reemplaces `.env.local`, `.git`, `node_modules`, `.next`, `package.json` ni `pnpm-lock.yaml`.
4. Ejecuta `corepack pnpm dev` y prueba `/productos/proteina`, cambiando entre Vainilla y Chocolate; verifica que las tablas cambian con el sabor.
5. Después detén el servidor y ejecuta `corepack pnpm build`.
6. No hagas `git push` hasta revisar el resultado local.
