-- Listings table for ProSparrow FSBO marketplace.
-- Run this in the Supabase SQL Editor (Database > SQL Editor > New query).

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  listing_type text not null check (listing_type in ('sale', 'rent')),
  property_type text not null check (
    property_type in ('apartment', 'house', 'studio', 'penthouse', 'land', 'commercial')
  ),
  city text not null,
  address text not null,
  price numeric not null check (price >= 0),
  currency text not null default 'EUR',
  price_period text not null default 'total' check (price_period in ('total', 'monthly')),
  area_sqm numeric not null check (area_sqm > 0),
  rooms integer not null check (rooms >= 0),
  bathrooms integer not null check (bathrooms >= 0),
  floor text,
  year_built text,
  description text not null,
  features text[] not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_city_idx on public.listings (city);
create index if not exists listings_property_type_idx on public.listings (property_type);
create index if not exists listings_price_idx on public.listings (price);
create index if not exists listings_owner_id_idx on public.listings (owner_id);

alter table public.listings enable row level security;

-- Anyone (including anonymous visitors) can read listings — public marketplace.
create policy "Listings are publicly readable"
  on public.listings for select
  using (true);

-- Only authenticated users can create a listing, and only as themselves.
create policy "Owners can insert their own listings"
  on public.listings for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Only the owner can update their own listing.
create policy "Owners can update their own listings"
  on public.listings for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Only the owner can delete their own listing.
create policy "Owners can delete their own listings"
  on public.listings for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Keep updated_at current on every row change.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
  before update on public.listings
  for each row
  execute function public.set_updated_at();
