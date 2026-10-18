-- Añade el número de Orden de Flete Starken al pedido.
-- Ejecutar una vez en Supabase > SQL Editor.
alter table public.pedidos
  add column if not exists starken_numero_envio text;

create index if not exists pedidos_cliente_email_created_idx
  on public.pedidos (cliente_email, created_at desc);
