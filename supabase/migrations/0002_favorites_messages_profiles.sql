-- Adds: map coordinates + photos on listings, per-user profile (phone),
-- persistent favorites, and contact messages.
-- Run this in the Supabase SQL Editor after 0001_create_listings.sql.

alter table public.listings
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists photo_paths text[] not null default '{}';

-- ---------- profiles (phone number for "Prikaži broj telefona") ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can upsert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------- favorites ----------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------- messages (buyer -> owner contact) ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Anyone can send a message (no account required to contact an owner),
-- but owner_id must match the listing's actual owner — prevents a client
-- from writing a message into someone else's inbox.
create policy "Anyone can send a message tied to the real listing owner"
  on public.messages for insert
  to public
  with check (
    owner_id = (select owner_id from public.listings where id = listing_id)
  );

create policy "Owners can read their own messages"
  on public.messages for select
  to authenticated
  using (auth.uid() = owner_id);

create index if not exists messages_owner_id_idx on public.messages (owner_id);
create index if not exists messages_listing_id_idx on public.messages (listing_id);

-- ---------- storage bucket for listing photos ----------
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "Listing photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Owners can upload their own listing photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owners can delete their own listing photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
