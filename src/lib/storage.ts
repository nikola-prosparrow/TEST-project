import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "listing-photos";

export async function uploadListingPhotos(
  supabase: SupabaseClient,
  userId: string,
  listingId: string,
  files: File[],
): Promise<string[]> {
  const paths: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!file || file.size === 0) continue;
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${userId}/${listingId}/${index}-${safeName}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || undefined,
      upsert: true,
    });
    if (error) throw new Error(`Failed to upload photo "${file.name}": ${error.message}`);
    paths.push(path);
  }

  return paths;
}

export function getPhotoUrl(supabase: SupabaseClient, path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Pure, no SDK/network call needed — usable from client components too,
// since NEXT_PUBLIC_SUPABASE_URL is inlined into the client bundle.
export function publicPhotoUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
