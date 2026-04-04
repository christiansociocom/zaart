-- Run this in your Supabase SQL editor to set up the database.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Products table
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text not null check (category in ('trays','kitchen-dining','storage-organizers','furniture','decor')),
  price         integer not null,             -- stored in Tshs (whole numbers)
  price_variants jsonb default null,          -- [{label, price}, ...]
  description   text not null default '',
  images        text[] not null default '{}', -- array of Cloudinary URLs
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure update_updated_at();

-- 3. Row-level security
alter table products enable row level security;

-- Public can read
create policy "Public read products"
  on products for select using (true);

-- Seller emails allowed to insert/update/delete (Google OAuth JWT email).
-- Postgres session settings are NOT set by Supabase from Next.js env vars — do not use
-- current_setting('app.seller_email') for RLS; it stays empty and blocks all writes.
create table if not exists seller_allowlist (
  email text primary key
);

alter table seller_allowlist enable row level security;
-- No policies: clients cannot read or modify the list; only SQL editor / service role.

create or replace function public.is_seller()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.seller_allowlist sa
    where lower(sa.email) = lower(trim(coalesce((auth.jwt() ->> 'email'), '')))
  );
$$;

revoke all on function public.is_seller() from public;
grant execute on function public.is_seller() to authenticated;

-- After running this file, add your Google sign-in email once (Supabase SQL editor):
--   insert into public.seller_allowlist (email) values ('you@gmail.com');

create policy "Seller insert"
  on products for insert with check (is_seller());

create policy "Seller update"
  on products for update using (is_seller());

create policy "Seller delete"
  on products for delete using (is_seller());

-- 4. Storage bucket for product images (Cloudinary handles uploads,
--    but if you prefer Supabase storage, uncomment below)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
