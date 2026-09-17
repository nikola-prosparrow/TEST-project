export interface FavoritesRepository {
  listIdsByUser(userId: string): Promise<string[]>;
  add(userId: string, listingId: string): Promise<void>;
  remove(userId: string, listingId: string): Promise<void>;
}
