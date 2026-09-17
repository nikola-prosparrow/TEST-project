import { createClient } from "@/lib/supabase/server";
import { createInMemoryTransactionsRepository } from "./inMemoryRepository";
import { createSupabaseTransactionsRepository } from "./supabaseRepository";
import type { TransactionsRepository } from "./types";

export type {
  Transaction,
  TransactionStage,
  DocumentKey,
  DocumentStatus,
  DepositStage,
  TransactionDocument,
  UpdateTransactionInput,
  TransactionsRepository,
} from "./types";
export { DOCUMENT_KEYS } from "./types";

const fallback = createInMemoryTransactionsRepository();

export async function getTransactionsRepository(): Promise<TransactionsRepository> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    return createSupabaseTransactionsRepository(supabase);
  }
  return fallback;
}
