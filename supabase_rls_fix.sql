-- Fix RLS for admin product writes (run in Supabase → SQL Editor).
-- Root cause: is_seller() compared auth to current_setting('app.seller_email'),
-- which Supabase never sets — every insert/update/delete failed.

create table if not exists public.seller_allowlist (
  email text primary key
);

alter table public.seller_allowlist enable row level security;

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

-- 1) Replace YOUR_GOOGLE_EMAIL with the exact email you use for “Sign in with Google”.
-- 2) Re-run safely: uses ON CONFLICT DO NOTHING if the row already exists.
insert into public.seller_allowlist (email)
values ('YOUR_GOOGLE_EMAIL')
on conflict (email) do nothing;
