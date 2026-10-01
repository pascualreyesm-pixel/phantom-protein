create extension if not exists pgcrypto;

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido text not null unique,
  estado text not null default 'pendiente_de_pago'
    check (estado in (
      'pendiente_de_pago', 'pagado', 'preparando', 'despachado', 'entregado', 'cancelado'
    )),
  cliente_nombre text not null,
  cliente_apellido text not null,
  cliente_rut text not null,
  cliente_email text not null,
  cliente_telefono text not null,
  direccion text not null,
  numero_direccion text not null,
  depto text,
  comuna text not null,
  region text not null,
  items jsonb not null,
  subtotal integer not null check (subtotal >= 0),
  costo_envio integer not null check (costo_envio >= 0),
  total integer not null check (total >= 0),
  mercadopago_order_id text unique,
  mercadopago_payment_id text unique,
  mercadopago_status text,
  mercadopago_status_detail text,
  pagado_at timestamptz,
  email_enviado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pedidos add column if not exists mercadopago_order_id text unique;
alter table public.pedidos add column if not exists mercadopago_payment_id text unique;
alter table public.pedidos add column if not exists mercadopago_status text;
alter table public.pedidos add column if not exists mercadopago_status_detail text;
alter table public.pedidos add column if not exists pagado_at timestamptz;
alter table public.pedidos add column if not exists email_enviado_at timestamptz;

create index if not exists pedidos_estado_idx on public.pedidos (estado);
create index if not exists pedidos_created_at_idx on public.pedidos (created_at desc);
create index if not exists pedidos_mp_order_idx on public.pedidos (mercadopago_order_id);
create index if not exists pedidos_mp_status_idx on public.pedidos (mercadopago_status);

alter table public.pedidos enable row level security;
revoke all on table public.pedidos from anon, authenticated;
grant all on table public.pedidos to service_role;
