import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function upsertPhone(userId: string, phone: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({ id: userId, phone });
  if (error) throw new Error(`Failed to save phone number: ${error.message}`);
}

export async function getPhoneByOwnerId(
  supabase: SupabaseClient,
  ownerId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", ownerId)
    .maybeSingle();
  if (error) return null;
  return data?.phone ?? null;
}

export async function getOwnerPhone(ownerId: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  return getPhoneByOwnerId(supabase, ownerId);
}
