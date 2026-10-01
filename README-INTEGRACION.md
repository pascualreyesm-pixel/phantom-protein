# Phantom Protein — pagos + pedidos + email

Esta versión usa la API moderna de **Orders de Checkout Pro de Mercado Pago**. Mercado Pago mantiene Preferences API, pero actualmente recomienda Orders API para integraciones nuevas.

## Flujo

1. El cliente completa sus datos.
2. Phantom guarda el pedido como `pendiente_de_pago` en Supabase.
3. Phantom crea una order en Mercado Pago y redirige al `checkout_url`.
4. Mercado Pago notifica a Phantom mediante Webhook.
5. Phantom valida la firma, consulta `/v1/orders/{id}` y verifica monto/estado.
6. Solo si la order está `processed` + `accredited` se marca el pedido como `pagado`.
7. Se envía el email de despacho mediante Resend.

## Archivos

- `lib/payment/types.ts`
- `lib/payment/mercadopago-provider.ts`
- `lib/payment/index.ts`
- `lib/supabase/server.ts`
- `lib/pedidos.ts`
- `lib/email/pedido.ts`
- `app/api/pedido/route.ts`
- `app/api/webhooks/mercadopago/route.ts`
- `components/checkout-form.tsx`
- `app/pedido/confirmacion/page.tsx`
- `components/hero-home.tsx`
- `supabase/schema.sql`
- `.env.example`

## Instalación

```powershell
pnpm add @supabase/supabase-js
```

## Supabase

1. Crea el proyecto.
2. Abre SQL Editor.
3. Pega `supabase/schema.sql` y ejecútalo.
4. Copia Project URL y una Secret Key.
5. Guárdalas solo en `.env.local`.

## Mercado Pago

1. En Mercado Pago Developers entra a **Tus integraciones**.
2. Crea una aplicación para pagos online/Checkout Pro.
3. En Credenciales de prueba copia el **Access Token de prueba**.
4. En Webhooks configura una URL de pruebas HTTPS.
5. Selecciona el evento de Orders/Order (Mercado Pago), según cómo aparezca en tu panel.
6. Copia la clave secreta del Webhook.
7. URL del webhook:

```text
https://TU-DOMINIO/api/webhooks/mercadopago
```

8. Para producción, configura también la URL HTTPS productiva y usa las credenciales productivas.

## Variables

```env
NEXT_PUBLIC_URL=https://phantomprotein.cl
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_WEBHOOK_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
RESEND_API_KEY=...
PEDIDO_EMAIL_DESTINO=...
RESEND_FROM_EMAIL=Phantom Protein <onboarding@resend.dev>
```

## Resend

Para la prueba inicial puedes usar `onboarding@resend.dev` como remitente. Para producción, verifica el dominio de Phantom en Resend y usa un remitente de ese dominio.

## URLs y local

No uses `localhost` como `NEXT_PUBLIC_URL` para Mercado Pago. La aplicación necesita una URL pública HTTPS para los retornos y el Webhook.

## Pruebas

Mercado Pago recomienda cuentas de prueba comprador/vendedor y tarjetas de prueba. Realiza las compras de prueba desde una ventana de incógnito.

## Seguridad

Nunca subas a GitHub ni pegues públicamente estas claves:

- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
