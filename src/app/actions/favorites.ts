"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFavoritesRepository } from "@/lib/favorites";

export async function toggleFavoriteAction(listingId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent("/")}`);

  const repo = await getFavoritesRepository();
  const current = await repo.listIdsByUser(user.id);

  if (current.includes(listingId)) {
    await repo.remove(user.id, listingId);
    return false;
  }
  await repo.add(user.id, listingId);
  return true;
}

export async function getFavoriteIdsAction(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const repo = await getFavoritesRepository();
  return repo.listIdsByUser(user.id);
}
