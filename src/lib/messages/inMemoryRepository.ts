import { randomUUID } from "node:crypto";
import type { Message, MessagesRepository } from "./types";

export function createInMemoryMessagesRepository(): MessagesRepository {
  const messages: Message[] = [];

  return {
    async create(input) {
      const message: Message = {
        id: randomUUID(),
        listingId: input.listingId,
        ownerId: input.ownerId,
        senderName: input.senderName,
        senderEmail: input.senderEmail,
        senderPhone: input.senderPhone ?? null,
        body: input.body,
        createdAt: new Date().toISOString(),
      };
      messages.push(message);
      return message;
    },

    async listByOwner(ownerId) {
      return messages.filter((m) => m.ownerId === ownerId);
    },
  };
}
