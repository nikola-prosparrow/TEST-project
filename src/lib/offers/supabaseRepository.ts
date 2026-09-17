import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateOfferInput, Offer, OffersRepository, OfferStatus } from "./types";

type OfferRow = {
  id: string;
  listing_id: string;
  owner_id: string;
  bidder_id: string;
  bidder_name: string;
  bidder_email: string;
  amount: number;
  currency: string;
  message: string | null;
  status: OfferStatus;
  created_at: string;
};

function fromRow(row: OfferRow): Offer {
  return {
    id: row.id,
    listingId: row.listing_id,
    ownerId: row.owner_id,
    bidderId: row.bidder_id,
    bidderName: row.bidder_name,
    bidderEmail: row.bidder_email,
    amount: row.amount,
    currency: row.currency,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function createSupabaseOffersRepository(supabase: SupabaseClient): OffersRepository {
  return {
    async create(input: CreateOfferInput, bidderId: string) {
      const { data, error } = await supabase
        .from("offers")
        .insert({
          listing_id: input.listingId,
          owner_id: input.ownerId,
          bidder_id: bidderId,
          bidder_name: input.bidderName,
          bidder_email: input.bidderEmail,
          amount: input.amount,
          message: input.message ?? null,
        })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create offer: ${error.message}`);
      return fromRow(data as OfferRow);
    },

    async listByOwner(ownerId: string) {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("owner_id", ownerId)
        .order("amount", { ascending: false });
      if (error) throw new Error(`Failed to list offers: ${error.message}`);
      return (data as OfferRow[]).map(fromRow);
    },

    async listByBidder(bidderId: string) {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("bidder_id", bidderId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(`Failed to list offers: ${error.message}`);
      return (data as OfferRow[]).map(fromRow);
    },

    async updateStatus(offerId: string, status: OfferStatus) {
      const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);
      if (error) throw new Error(`Failed to update offer ${offerId}: ${error.message}`);
    },
  };
}
