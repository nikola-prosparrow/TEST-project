-- C5 MVP: reservation -> arras -> notary process TRACKER.
-- This does NOT generate legal contracts and does NOT process any
-- payment. It only tracks stage/dates/amounts that the two parties
-- agree on and handle themselves (ideally with a real-estate lawyer).
-- Run after 0001, 0002, 0003.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  offer_id uuid not null unique references public.offers(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  stage text not null default 'reservation' check (stage in ('reservation', 'arras', 'notary', 'completed', 'cancelled')),
  reservation_deposit_amount numeric,
  reservation_deadline date,
  arras_deposit_amount numeric,
  arras_signing_date date,
  notary_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_owner_id_idx on public.transactions (owner_id);
create index if not exists transactions_buyer_id_idx on public.transactions (buyer_id);

alter table public.transactions enable row level security;

create policy "Owners can view their transactions"
  on public.transactions for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "Buyers can view their transactions"
  on public.transactions for select
  to authenticated
  using (auth.uid() = buyer_id);

create policy "Owners can insert transactions on their own listings"
  on public.transactions for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update their transactions"
  on public.transactions for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

-- ---------- document checklist ----------
create table if not exists public.transaction_documents (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  document_key text not null check (
    document_key in ('nota_simple', 'cedula_habitabilidad', 'ite', 'cee', 'deuda_cero', 'vpo_check')
  ),
  status text not null default 'pending' check (status in ('pending', 'requested', 'received', 'not_applicable')),
  updated_at timestamptz not null default now(),
  unique (transaction_id, document_key)
);

alter table public.transaction_documents enable row level security;

create policy "Owners can view documents on their transactions"
  on public.transaction_documents for select
  to authenticated
  using (
    auth.uid() = (select owner_id from public.transactions where id = transaction_id)
  );

create policy "Buyers can view documents on their transactions"
  on public.transaction_documents for select
  to authenticated
  using (
    auth.uid() = (select buyer_id from public.transactions where id = transaction_id)
  );

create policy "Owners can insert documents on their transactions"
  on public.transaction_documents for insert
  to authenticated
  with check (
    auth.uid() = (select owner_id from public.transactions where id = transaction_id)
  );

create policy "Owners can update documents on their transactions"
  on public.transaction_documents for update
  to authenticated
  using (
    auth.uid() = (select owner_id from public.transactions where id = transaction_id)
  )
  with check (
    auth.uid() = (select owner_id from public.transactions where id = transaction_id)
  );

create trigger transaction_documents_set_updated_at
  before update on public.transaction_documents
  for each row
  execute function public.set_updated_at();
