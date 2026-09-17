-- C6 MVP: mutual "deposit paid offline" confirmation (NOT a payment —
-- both sides just acknowledge money changed hands outside the
-- platform, e.g. bank transfer). C7 MVP: best-and-final deadline on
-- a listing so bidders know when to submit their final offer.
-- Run after 0001-0004.

alter table public.transactions
  add column if not exists reservation_deposit_confirmed_by_owner boolean not null default false,
  add column if not exists reservation_deposit_confirmed_by_buyer boolean not null default false,
  add column if not exists arras_deposit_confirmed_by_owner boolean not null default false,
  add column if not exists arras_deposit_confirmed_by_buyer boolean not null default false;

-- Buyers only get to flip their own confirmation flags to true — never
-- a general UPDATE policy, which would let them edit amounts/dates/stage
-- too. SECURITY DEFINER so it can update despite the buyer having no
-- general UPDATE policy on this table.
create or replace function public.confirm_deposit(p_transaction_id uuid, p_stage text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_stage = 'reservation' then
    update public.transactions
    set reservation_deposit_confirmed_by_buyer = true
    where id = p_transaction_id and buyer_id = auth.uid();
  elsif p_stage = 'arras' then
    update public.transactions
    set arras_deposit_confirmed_by_buyer = true
    where id = p_transaction_id and buyer_id = auth.uid();
  else
    raise exception 'invalid stage: %', p_stage;
  end if;
end;
$$;

revoke all on function public.confirm_deposit(uuid, text) from public;
grant execute on function public.confirm_deposit(uuid, text) to authenticated;

alter table public.listings
  add column if not exists best_final_deadline timestamptz;
