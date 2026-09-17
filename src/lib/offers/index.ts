import { createClient } from "@/lib/supabase/server";
import { createInMemoryOffersRepository } from "./inMemoryRepository";
import { createSupabaseOffersRepository } from "./supabaseRepository";
import type { OffersRepository } from "./types";

export type { Offer, OfferStatus, CreateOfferInput, OffersRepository } from "./types";

const fallback = createInMemoryOffersRepository();

export async function getOffersRepository(): Promise<OffersRepository> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    return createSupabaseOffersRepository(supabase);
  }
  return fallback;
}
