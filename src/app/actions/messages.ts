"use server";

import { getMessagesRepository } from "@/lib/messages";

export type SendMessageActionState = { error: string | null; sent: boolean };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function sendMessageAction(
  _prevState: SendMessageActionState,
  formData: FormData,
): Promise<SendMessageActionState> {
  const listingId = str(formData, "listingId");
  const ownerId = str(formData, "ownerId");
  const senderName = str(formData, "senderName");
  const senderEmail = str(formData, "senderEmail");
  const senderPhone = str(formData, "senderPhone");
  const body = str(formData, "body");

  if (!listingId || !ownerId) {
    return { error: "Nedostaju podaci o oglasu.", sent: false };
  }
  if (!senderName) {
    return { error: "Unesi svoje ime.", sent: false };
  }
  if (!senderEmail || !senderEmail.includes("@")) {
    return { error: "Unesi validan email.", sent: false };
  }
  if (!body || body.length < 10) {
    return { error: "Poruka mora imati bar 10 karaktera.", sent: false };
  }

  const repo = await getMessagesRepository();
  await repo.create({
    listingId,
    ownerId,
    senderName,
    senderEmail,
    senderPhone: senderPhone || undefined,
    body,
  });

  return { error: null, sent: true };
}
