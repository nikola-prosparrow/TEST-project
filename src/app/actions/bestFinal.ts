"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getListingsRepository } from "@/lib/listings";

export async function setBestFinalDeadlineAction(listingId: string, deadline: string | null): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const repo = await getListingsRepository();
  const listing = await repo.getById(listingId);
  if (!listing || listing.ownerId !== user.id) {
    throw new Error("Not authorized");
  }

  await repo.setBestFinalDeadline(listingId, deadline);
  revalidatePath(`/listing/${listingId}`);
}
