# Phantom Protein — rediseño visual (para integrar sobre c678fe5)

Este ZIP es un **parche de archivos**, no una copia completa del proyecto. Se preparó tomando como base el ZIP `phantom-protein-actualizado.zip` que compartiste. Descomprime su contenido en la raíz de `phantom-protein-new` conservando las carpetas; Windows te pedirá reemplazar algunos archivos.

## Qué incluye

- Header negro con barra superior crema, navegación desplegable, búsqueda real en el catálogo, aviso de cuenta y carrito conectado al `CarritoDrawer` actual.
- Carrusel de tres diapositivas con reproducción automática, flechas, indicadores y pausa manual.
- Catálogo de tres familias: proteína (con dos sabores internos), creatina y colágeno + açaí.
- Página por producto con galería a la izquierda, información, selector de sabor y botón conectado al carrito. Rutas: `/productos/proteina`, `/productos/creatina`, `/productos/colageno`.
- Banner Conocer la línea, ticker animado y compra por objetivo en `/productos`.
- Video real con controles nativos, carga diferida (`preload="none"`) y poster para no descargarlo antes de reproducirlo.
- Sección de ADN y fórmula abajo de la página de inicio.
- Footer adaptado a negro y crema.
- Precios de catálogo de acuerdo con la confirmación del usuario: proteína $59.990, creatina $15.990, colágeno + açaí $20.990.

## Archivos incluidos

Los archivos `app`, `components`, `lib` y `public` de este ZIP son rutas para copiar sobre el proyecto existente. No se incluyen `node_modules`, `.next`, `.git`, `.env.local` ni credenciales.

## Instalación segura

1. Confirma estar en la carpeta correcta con `Get-Location`.
2. Haz una copia local de los archivos actuales o duplica la carpeta del proyecto antes de aplicar el parche.
3. Extrae el ZIP dentro de la raíz del proyecto y acepta reemplazar los archivos incluidos.
4. En PowerShell, ejecuta `git status -sb` para ver los cambios locales. **No hagas `git push` todavía.**
5. Ejecuta `pnpm dev` y comprueba las rutas `/`, `/productos`, `/productos/proteina`, `/productos/creatina`, `/productos/colageno` y `/checkout`.
6. Detén el servidor con Ctrl+C y ejecuta `pnpm build`.
7. Prueba el carrito y checkout con productos; no hagas un pago real durante esta prueba.

## Importante sobre pagos

El parche preserva las rutas y el código de Mercado Pago/Supabase/Resend que ya venían en la versión `c678fe5`, y mantiene los IDs `proteina-vainilla`, `proteina-chocolate`, `creatina` y `colageno-acai`. Actualiza el precio en el catálogo compartido, que usa el servidor al calcular el pedido. No incluye claves privadas ni cambia `.env.local`.

Tener el código preparado no confirma que la integración esté lista para producción. Antes de cobrar, hay que verificar las variables privadas, el proyecto Supabase y su esquema, las credenciales de prueba de Mercado Pago, la URL pública del webhook, la firma, el retorno de checkout y el correo de confirmación. Primero probar en modo test.

La integración con Mercado Libre (marketplace) es distinta de aceptar pagos con Mercado Pago. No se configuró una cuenta o catálogo de Mercado Libre en este parche porque requiere sus propias credenciales y autorizaciones.

## Imágenes y video añadidos

Se usan únicamente los recursos Phantom Protein adjuntos por ti, además de los PNG transparentes ya presentes en el proyecto. Las fotos se optimizaron a WebP y se guardaron bajo `public/images/phantom/`. El video se dejó en MP4 y se reproduce solo al pulsar Play.
