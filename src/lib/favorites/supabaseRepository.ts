import type { SupabaseClient } from "@supabase/supabase-js";
import type { FavoritesRepository } from "./types";

export function createSupabaseFavoritesRepository(supabase: SupabaseClient): FavoritesRepository {
  return {
    async listIdsByUser(userId: string) {
      const { data, error } = await supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", userId);
      if (error) throw new Error(`Failed to list favorites: ${error.message}`);
      return (data ?? []).map((row) => row.listing_id as string);
    },

    async add(userId: string, listingId: string) {
      const { error } = await supabase
        .from("favorites")
        .upsert({ user_id: userId, listing_id: listingId }, { onConflict: "user_id,listing_id" });
      if (error) throw new Error(`Failed to add favorite: ${error.message}`);
    },

    async remove(userId: string, listingId: string) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);
      if (error) throw new Error(`Failed to remove favorite: ${error.message}`);
    },
  };
}
