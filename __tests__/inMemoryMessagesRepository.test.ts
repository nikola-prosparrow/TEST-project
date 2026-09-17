import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryMessagesRepository } from "../src/lib/messages/inMemoryRepository";
import type { MessagesRepository } from "../src/lib/messages/types";

describe("InMemoryMessagesRepository", () => {
  let repo: MessagesRepository;

  beforeEach(() => {
    repo = createInMemoryMessagesRepository();
  });

  test("create() returns a message with a generated id", async () => {
    const message = await repo.create({
      listingId: "listing-a",
      ownerId: "owner-1",
      senderName: "Marko",
      senderEmail: "marko@example.com",
      body: "Da li je stan i dalje dostupan?",
    });

    expect(message.id).toBeTruthy();
    expect(message.senderName).toBe("Marko");
  });

  test("listByOwner() returns only messages for that owner", async () => {
    await repo.create({
      listingId: "listing-a",
      ownerId: "owner-1",
      senderName: "Marko",
      senderEmail: "marko@example.com",
      body: "Da li je stan i dalje dostupan?",
    });
    await repo.create({
      listingId: "listing-b",
      ownerId: "owner-2",
      senderName: "Ana",
      senderEmail: "ana@example.com",
      body: "Zainteresovana sam za razgledanje.",
    });

    const ownerOneMessages = await repo.listByOwner("owner-1");
    expect(ownerOneMessages).toHaveLength(1);
    expect(ownerOneMessages[0].senderName).toBe("Marko");
  });

  test("listByOwner() returns an empty array when there are no messages", async () => {
    expect(await repo.listByOwner("owner-does-not-exist")).toEqual([]);
  });
});
