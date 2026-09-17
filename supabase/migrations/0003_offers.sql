-- Offers/bidding: buyers submit formal offers on a listing, the owner
-- sees all of them (sealed-bid — bidders do not see each other's amounts)
-- and accepts/rejects. Run after 0001 and 0002.

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  bidder_name text not null,
  bidder_email text not null,
  amount numeric not null check (amount > 0),
  currency text not null default 'EUR',
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (owner_id <> bidder_id)
);

create index if not exists offers_listing_id_idx on public.offers (listing_id);
create index if not exists offers_owner_id_idx on public.offers (owner_id);
create index if not exists offers_bidder_id_idx on public.offers (bidder_id);

alter table public.offers enable row level security;

-- A bidder can only create an offer as themselves, and owner_id must match
-- the listing's real owner (prevents writing an offer into the wrong inbox).
create policy "Bidders can submit offers tied to the real listing owner"
  on public.offers for insert
  to authenticated
  with check (
    auth.uid() = bidder_id
    and owner_id = (select owner_id from public.listings where id = listing_id)
  );

create policy "Bidders can view their own offers"
  on public.offers for select
  to authenticated
  using (auth.uid() = bidder_id);

create policy "Owners can view offers on their own listings"
  on public.offers for select
  to authenticated
  using (auth.uid() = owner_id);

-- Owners accept/reject; bidders withdraw. Both are just status updates.
create policy "Owners can update the status of offers on their listings"
  on public.offers for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Bidders can withdraw their own offers"
  on public.offers for update
  to authenticated
  using (auth.uid() = bidder_id)
  with check (auth.uid() = bidder_id and status = 'withdrawn');

create trigger offers_set_updated_at
  before update on public.offers
  for each row
  execute function public.set_updated_at();
