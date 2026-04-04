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

-- Only authenticated users whose email matches the env var can write.
-- NOTE: set NEXT_PUBLIC_SELLER_EMAIL in your .env so the check works.
-- We use a helper function so the email is never exposed to the client.
create or replace function is_seller()
returns boolean language plpgsql security definer as $$
begin
  return (auth.email() = current_setting('app.seller_email', true));
end;
$$;

create policy "Seller insert"
  on products for insert with check (is_seller());

create policy "Seller update"
  on products for update using (is_seller());

create policy "Seller delete"
  on products for delete using (is_seller());

-- 4. Storage bucket for product images (Cloudinary handles uploads,
--    but if you prefer Supabase storage, uncomment below)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
