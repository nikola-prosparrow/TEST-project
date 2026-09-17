import { randomUUID } from "node:crypto";
import type { Offer, OffersRepository } from "./types";

export function createInMemoryOffersRepository(): OffersRepository {
  const offers: Offer[] = [];

  return {
    async create(input, bidderId) {
      const offer: Offer = {
        id: randomUUID(),
        listingId: input.listingId,
        ownerId: input.ownerId,
        bidderId,
        bidderName: input.bidderName,
        bidderEmail: input.bidderEmail,
        amount: input.amount,
        currency: "EUR",
        message: input.message ?? null,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      offers.push(offer);
      return offer;
    },

    async getById(offerId) {
      return offers.find((o) => o.id === offerId) ?? null;
    },

    async listByOwner(ownerId) {
      return offers.filter((o) => o.ownerId === ownerId);
    },

    async listByBidder(bidderId) {
      return offers.filter((o) => o.bidderId === bidderId);
    },

    async updateStatus(offerId, status) {
      const offer = offers.find((o) => o.id === offerId);
      if (offer) offer.status = status;
    },
  };
}
