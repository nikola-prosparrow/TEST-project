import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateMessageInput, Message, MessagesRepository } from "./types";

type MessageRow = {
  id: string;
  listing_id: string;
  owner_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  body: string;
  created_at: string;
};

function fromRow(row: MessageRow): Message {
  return {
    id: row.id,
    listingId: row.listing_id,
    ownerId: row.owner_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    senderPhone: row.sender_phone,
    body: row.body,
    createdAt: row.created_at,
  };
}

export function createSupabaseMessagesRepository(supabase: SupabaseClient): MessagesRepository {
  return {
    async create(input: CreateMessageInput) {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          listing_id: input.listingId,
          owner_id: input.ownerId,
          sender_name: input.senderName,
          sender_email: input.senderEmail,
          sender_phone: input.senderPhone ?? null,
          body: input.body,
        })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to send message: ${error.message}`);
      return fromRow(data as MessageRow);
    },

    async listByOwner(ownerId: string) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(`Failed to list messages: ${error.message}`);
      return (data as MessageRow[]).map(fromRow);
    },
  };
}
