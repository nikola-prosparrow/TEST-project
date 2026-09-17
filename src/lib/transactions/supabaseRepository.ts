import type { SupabaseClient } from "@supabase/supabase-js";
import { DOCUMENT_KEYS } from "./types";
import type {
  DocumentKey,
  DocumentStatus,
  Transaction,
  TransactionsRepository,
  TransactionStage,
  UpdateTransactionInput,
} from "./types";

type TransactionRow = {
  id: string;
  listing_id: string;
  offer_id: string;
  owner_id: string;
  buyer_id: string;
  stage: TransactionStage;
  reservation_deposit_amount: number | null;
  reservation_deadline: string | null;
  reservation_deposit_confirmed_by_owner: boolean;
  reservation_deposit_confirmed_by_buyer: boolean;
  arras_deposit_amount: number | null;
  arras_signing_date: string | null;
  arras_deposit_confirmed_by_owner: boolean;
  arras_deposit_confirmed_by_buyer: boolean;
  notary_date: string | null;
  created_at: string;
};

type DocumentRow = {
  document_key: DocumentKey;
  status: DocumentStatus;
};

function fromRow(row: TransactionRow, documents: { key: DocumentKey; status: DocumentStatus }[]): Transaction {
  return {
    id: row.id,
    listingId: row.listing_id,
    offerId: row.offer_id,
    ownerId: row.owner_id,
    buyerId: row.buyer_id,
    stage: row.stage,
    reservationDepositAmount: row.reservation_deposit_amount,
    reservationDeadline: row.reservation_deadline,
    reservationDepositConfirmedByOwner: row.reservation_deposit_confirmed_by_owner,
    reservationDepositConfirmedByBuyer: row.reservation_deposit_confirmed_by_buyer,
    arrasDepositAmount: row.arras_deposit_amount,
    arrasSigningDate: row.arras_signing_date,
    arrasDepositConfirmedByOwner: row.arras_deposit_confirmed_by_owner,
    arrasDepositConfirmedByBuyer: row.arras_deposit_confirmed_by_buyer,
    notaryDate: row.notary_date,
    documents,
    createdAt: row.created_at,
  };
}

async function loadDocuments(supabase: SupabaseClient, transactionId: string) {
  const { data, error } = await supabase
    .from("transaction_documents")
    .select("document_key, status")
    .eq("transaction_id", transactionId);
  if (error) throw new Error(`Failed to load documents: ${error.message}`);
  return (data as DocumentRow[]).map((d) => ({ key: d.document_key, status: d.status }));
}

export function createSupabaseTransactionsRepository(supabase: SupabaseClient): TransactionsRepository {
  return {
    async createForOffer(offerId, listingId, ownerId, buyerId) {
      const { data, error } = await supabase
        .from("transactions")
        .insert({ offer_id: offerId, listing_id: listingId, owner_id: ownerId, buyer_id: buyerId })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create transaction: ${error.message}`);

      const row = data as TransactionRow;
      const { error: docsError } = await supabase
        .from("transaction_documents")
        .insert(DOCUMENT_KEYS.map((key) => ({ transaction_id: row.id, document_key: key })));
      if (docsError) throw new Error(`Failed to seed document checklist: ${docsError.message}`);

      return fromRow(row, DOCUMENT_KEYS.map((key) => ({ key, status: "pending" as const })));
    },

    async getById(id) {
      const { data, error } = await supabase.from("transactions").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(`Failed to fetch transaction ${id}: ${error.message}`);
      if (!data) return null;
      const documents = await loadDocuments(supabase, id);
      return fromRow(data as TransactionRow, documents);
    },

    async getByOfferId(offerId) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("offer_id", offerId)
        .maybeSingle();
      if (error) throw new Error(`Failed to fetch transaction for offer ${offerId}: ${error.message}`);
      if (!data) return null;
      const row = data as TransactionRow;
      const documents = await loadDocuments(supabase, row.id);
      return fromRow(row, documents);
    },

    async listByUser(userId) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .or(`owner_id.eq.${userId},buyer_id.eq.${userId}`)
        .order("created_at", { ascending: false });
      if (error) throw new Error(`Failed to list transactions: ${error.message}`);
      const rows = data as TransactionRow[];
      return Promise.all(
        rows.map(async (row) => fromRow(row, await loadDocuments(supabase, row.id))),
      );
    },

    async update(id, input: UpdateTransactionInput) {
      const patch: Record<string, unknown> = {};
      if (input.stage !== undefined) patch.stage = input.stage;
      if (input.reservationDepositAmount !== undefined) patch.reservation_deposit_amount = input.reservationDepositAmount;
      if (input.reservationDeadline !== undefined) patch.reservation_deadline = input.reservationDeadline;
      if (input.reservationDepositConfirmedByOwner !== undefined)
        patch.reservation_deposit_confirmed_by_owner = input.reservationDepositConfirmedByOwner;
      if (input.arrasDepositAmount !== undefined) patch.arras_deposit_amount = input.arrasDepositAmount;
      if (input.arrasSigningDate !== undefined) patch.arras_signing_date = input.arrasSigningDate;
      if (input.arrasDepositConfirmedByOwner !== undefined)
        patch.arras_deposit_confirmed_by_owner = input.arrasDepositConfirmedByOwner;
      if (input.notaryDate !== undefined) patch.notary_date = input.notaryDate;

      const { error } = await supabase.from("transactions").update(patch).eq("id", id);
      if (error) throw new Error(`Failed to update transaction ${id}: ${error.message}`);
    },

    async updateDocumentStatus(transactionId, key, status) {
      const { error } = await supabase
        .from("transaction_documents")
        .update({ status })
        .eq("transaction_id", transactionId)
        .eq("document_key", key);
      if (error) throw new Error(`Failed to update document ${key}: ${error.message}`);
    },

    async confirmDepositAsBuyer(transactionId, stage) {
      const { error } = await supabase.rpc("confirm_deposit", {
        p_transaction_id: transactionId,
        p_stage: stage,
      });
      if (error) throw new Error(`Failed to confirm deposit: ${error.message}`);
    },
  };
}
