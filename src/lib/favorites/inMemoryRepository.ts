import type { FavoritesRepository } from "./types";

export function createInMemoryFavoritesRepository(): FavoritesRepository {
  const byUser = new Map<string, Set<string>>();

  return {
    async listIdsByUser(userId) {
      return Array.from(byUser.get(userId) ?? []);
    },

    async add(userId, listingId) {
      if (!byUser.has(userId)) byUser.set(userId, new Set());
      byUser.get(userId)!.add(listingId);
    },

    async remove(userId, listingId) {
      byUser.get(userId)?.delete(listingId);
    },
  };
}
