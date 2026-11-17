-- Phantom Protein: soporte para cupón BLACKPHANTOM15 y confirmación segura del pedido.
-- Ejecutar una sola vez en Supabase > SQL Editor > New query.

alter table public.pedidos
  add column if not exists descuento integer not null default 0,
  add column if not exists codigo_descuento text,
  add column if not exists token_confirmacion uuid;

create unique index if not exists pedidos_token_confirmacion_uidx
  on public.pedidos (token_confirmacion)
  where token_confirmacion is not null;

comment on column public.pedidos.descuento is 'Descuento total aplicado en CLP; el subtotal se guarda antes del descuento.';
comment on column public.pedidos.codigo_descuento is 'Código promocional validado por el servidor.';
comment on column public.pedidos.token_confirmacion is 'Token aleatorio para consultar el estado del pedido sin exponer datos personales.';
