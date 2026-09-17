export type OfferStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type Offer = {
  id: string;
  listingId: string;
  ownerId: string;
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
  amount: number;
  currency: string;
  message: string | null;
  status: OfferStatus;
  createdAt: string;
};

export type CreateOfferInput = {
  listingId: string;
  ownerId: string;
  bidderName: string;
  bidderEmail: string;
  amount: number;
  message?: string;
};

export interface OffersRepository {
  create(input: CreateOfferInput, bidderId: string): Promise<Offer>;
  listByOwner(ownerId: string): Promise<Offer[]>;
  listByBidder(bidderId: string): Promise<Offer[]>;
  updateStatus(offerId: string, status: OfferStatus): Promise<void>;
}
