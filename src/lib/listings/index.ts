import { createClient } from "@/lib/supabase/server";
import { createInMemoryRepository } from "./inMemoryRepository";
import { createSupabaseRepository } from "./supabaseRepository";
import type { ListingsRepository } from "./types";

export type { Listing, ListingFilters, CreateListingInput, ListingsRepository, ListingType, PropertyType, PricePeriod } from "./types";

// Supabase-backed when the project is configured (local dev with .env.local,
// or Vercel with the env vars set). Falls back to the in-memory repository
// otherwise — this is what keeps CI/unit tests hermetic and fast (see AD6).
export async function getListingsRepository(): Promise<ListingsRepository> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    return createSupabaseRepository(supabase);
  }
  return createInMemoryRepository();
}
