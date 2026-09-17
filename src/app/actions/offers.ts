"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOffersRepository } from "@/lib/offers";
import { getTransactionsRepository } from "@/lib/transactions";
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

export async function updateOfferStatusAction(
  offerId: string,
  status: OfferStatus,
): Promise<{ transactionId: string | null }> {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  const repo = await getOffersRepository();
  const offer = await repo.getById(offerId);
  if (!offer || offer.ownerId !== user.id) {
    return { transactionId: null };
  }

  await repo.updateStatus(offerId, status);

  if (status !== "accepted") {
    return { transactionId: null };
  }

  const transactionsRepo = await getTransactionsRepository();
  const existing = await transactionsRepo.getByOfferId(offerId);
  if (existing) {
    return { transactionId: existing.id };
  }
  const transaction = await transactionsRepo.createForOffer(
    offerId,
    offer.listingId,
    offer.ownerId,
    offer.bidderId,
  );
  return { transactionId: transaction.id };
}
