import { createClient } from "@/lib/supabase/server";
import { createInMemoryMessagesRepository } from "./inMemoryRepository";
import { createSupabaseMessagesRepository } from "./supabaseRepository";
import type { MessagesRepository } from "./types";

export type { Message, CreateMessageInput, MessagesRepository } from "./types";

const fallback = createInMemoryMessagesRepository();

export async function getMessagesRepository(): Promise<MessagesRepository> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    return createSupabaseMessagesRepository(supabase);
  }
  return fallback;
}
