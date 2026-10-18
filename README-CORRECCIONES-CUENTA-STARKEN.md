# Corrección de rutas, sellos, cuenta y seguimiento Starken

Este paquete está pensado para combinarse con el rediseño v3/v4/v5 ya instalado en `phantom-protein-new`. No reemplaza el proyecto completo ni cambia el proveedor de pagos.

## Qué corrige

- Crea la ruta real `/objetivos` que usa el menú y conecta las tarjetas a las fichas de producto.
- Conecta el botón `POR QUÉ PHANTOM` y `MARCA` con la sección de marca `/#por-que-phantom`.
- Inserta la sección `PorQuePhantom` en Inicio.
- Sustituye el popover de cuenta que decía que no había cuentas por un enlace funcional a `/cuenta`.
- Añade registro/inicio de sesión con Supabase Auth y una página `/mi-cuenta` para listar compras vinculadas al correo verificado.
- Incorpora los sellos gráficos que entregó el dueño del proyecto.
- Añade el campo de número de envío de Starken, que permite abrir el seguimiento oficial.

## 1. Combinar archivos

Extrae este ZIP y copia su contenido directamente a la raíz de `phantom-protein-new`, manteniendo las carpetas. Acepta combinar carpetas y reemplazar solo los archivos coincidentes. No elimines `.git`, `node_modules`, `.next` ni `.env.local`.

## 2. Configurar la clave pública de Supabase Auth

En Supabase, abre **Project Settings → API Keys** y copia el valor de la clave `Publishable` (normalmente empieza por `sb_publishable_`). No uses la Secret Key en el navegador.

Añade a `.env.local` esta variable, sin compartir su valor públicamente:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=PEGA_AQUI_TU_PUBLISHABLE_KEY
```

`NEXT_PUBLIC_SUPABASE_URL` debe existir ya. `SUPABASE_SECRET_KEY` se queda solo en servidor; nunca debe tener el prefijo `NEXT_PUBLIC_`.

En **Supabase → Authentication → URL Configuration**, permite las URL de tu web local y producción:

- `http://localhost:3000`
- `https://phantomprotein.cl`

Añade ambas a Redirect URLs si Supabase las pide. El proveedor de email debe permitir registros y confirmar correo. Para consultar pedidos, la cuenta debe verificar el mismo email que se usó durante el checkout.

## 3. Añadir columna de seguimiento en Supabase

Abre **SQL Editor** y ejecuta el contenido de `supabase/migrations/20261016_add_starken_tracking.sql` de este paquete. La migración agrega `starken_numero_envio` a `public.pedidos`. No borra ni cambia pedidos existentes.

Cuando despaches un pedido y obtengas el número de orden de flete Starken, edita esa fila en `public.pedidos` y completa `starken_numero_envio`. El usuario verá el número en `/mi-cuenta` y tendrá un botón hacia la página oficial de seguimiento de Starken.

## 4. Probar en local

```powershell
corepack pnpm dev
```

Prueba estas rutas:

- `/objetivos` debe abrir desde el principio de la página, no dar 404.
- En el carrusel, `POR QUÉ PHANTOM` debe llevar a la sección de marca en Inicio.
- `MARCA` también debe llevar a esa sección.
- `/cuenta` debe permitir iniciar sesión y registrarse.
- `/mi-cuenta` debe mostrar solo pedidos del correo autenticado y verificado.

Después de probar, detén el servidor y ejecuta `corepack pnpm build`. No hagas `git push` hasta que la compilación y los flujos principales funcionen.

## Límites reales de Starken

Starken publica integraciones de API (REST/SOAP) para emisión, etiquetas, despacho, cotización y seguimiento. En esta fase el sitio guarda el número de orden de flete y abre el seguimiento público de Starken; el estado automático dentro de Phantom Protein y la creación automática de envíos requieren acceso/credenciales y configuración comercial con Starken. Documentación oficial:

- https://starken.cl/integraciones
- https://developers.starken.cl/seguimiento
- Seguimiento público: https://www.starken.cl/seguimiento

## Nota importante sobre los sellos

Los archivos de los sellos fueron suministrados por el dueño del proyecto y se muestran tal como se recibieron. Antes de desplegarlos públicamente, verifica que la empresa tenga derecho a utilizarlos y que cada certificación sea válida para el fabricante/producto. En particular, la FDA indica que no aprueba los suplementos dietéticos antes de su comercialización; no anuncies el producto como "aprobado por FDA" sin una base legal específica y verificable: https://www.fda.gov/consumers/consumer-updates/10-facts-about-what-fda-does-and-does-not-approve
