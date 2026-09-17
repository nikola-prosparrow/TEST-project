import { createClient } from "@/lib/supabase/server";
import { createInMemoryFavoritesRepository } from "./inMemoryRepository";
import { createSupabaseFavoritesRepository } from "./supabaseRepository";
import type { FavoritesRepository } from "./types";

export type { FavoritesRepository } from "./types";

const fallback = createInMemoryFavoritesRepository();

export async function getFavoritesRepository(): Promise<FavoritesRepository> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    return createSupabaseFavoritesRepository(supabase);
  }
  return fallback;
}
