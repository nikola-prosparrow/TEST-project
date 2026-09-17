"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOffersRepository } from "@/lib/offers";
import type { OfferStatus } from "@/lib/offers/types";

export type CreateOfferActionState = { error: string | null; sent: boolean };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createOfferAction(
  _prevState: CreateOfferActionState,
  formData: FormData,
): Promise<CreateOfferActionState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent("/")}`);

  const listingId = str(formData, "listingId");
  const ownerId = str(formData, "ownerId");
  const bidderName = str(formData, "bidderName");
  const amount = Number(formData.get("amount"));
  const message = str(formData, "message");

  if (ownerId === user.id) {
    return { error: "Ne možeš podneti ponudu na sopstveni oglas.", sent: false };
  }
  if (!bidderName) {
    return { error: "Unesi svoje ime.", sent: false };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Iznos ponude mora biti pozitivan broj.", sent: false };
  }

  const repo = await getOffersRepository();
  await repo.create(
    {
      listingId,
      ownerId,
      bidderName,
      bidderEmail: user.email,
      amount,
      message: message || undefined,
    },
    user.id,
  );

  return { error: null, sent: true };
}

export async function updateOfferStatusAction(offerId: string, status: OfferStatus): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  const repo = await getOffersRepository();
  await repo.updateStatus(offerId, status);
}
