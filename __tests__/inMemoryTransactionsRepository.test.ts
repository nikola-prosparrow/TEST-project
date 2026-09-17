import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryTransactionsRepository } from "../src/lib/transactions/inMemoryRepository";
import type { TransactionsRepository } from "../src/lib/transactions/types";
import { DOCUMENT_KEYS } from "../src/lib/transactions/types";

describe("InMemoryTransactionsRepository", () => {
  let repo: TransactionsRepository;

  beforeEach(() => {
    repo = createInMemoryTransactionsRepository();
  });

  test("createForOffer() starts in the reservation stage with a full document checklist", async () => {
    const tx = await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");

    expect(tx.stage).toBe("reservation");
    expect(tx.documents).toHaveLength(DOCUMENT_KEYS.length);
    expect(tx.documents.every((d) => d.status === "pending")).toBe(true);
    expect(tx.reservationDepositConfirmedByOwner).toBe(false);
    expect(tx.reservationDepositConfirmedByBuyer).toBe(false);
  });

  test("confirmDepositAsBuyer() sets only the buyer's own confirmation flag", async () => {
    const tx = await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");
    await repo.confirmDepositAsBuyer(tx.id, "reservation");

    const found = await repo.getById(tx.id);
    expect(found?.reservationDepositConfirmedByBuyer).toBe(true);
    expect(found?.reservationDepositConfirmedByOwner).toBe(false);
    expect(found?.arrasDepositConfirmedByBuyer).toBe(false);
  });

  test("getByOfferId() finds the transaction created for that offer", async () => {
    const created = await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");
    const found = await repo.getByOfferId("offer-1");
    expect(found?.id).toBe(created.id);
  });

  test("getByOfferId() returns null when there is no transaction for that offer", async () => {
    expect(await repo.getByOfferId("does-not-exist")).toBeNull();
  });

  test("listByUser() returns transactions where the user is the owner or the buyer", async () => {
    await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");
    await repo.createForOffer("offer-2", "listing-2", "owner-2", "buyer-1");
    await repo.createForOffer("offer-3", "listing-3", "owner-3", "buyer-3");

    const forBuyerOne = await repo.listByUser("buyer-1");
    expect(forBuyerOne).toHaveLength(2);

    const forOwnerOne = await repo.listByUser("owner-1");
    expect(forOwnerOne).toHaveLength(1);
  });

  test("update() changes stage and tracked fields", async () => {
    const tx = await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");
    await repo.update(tx.id, { stage: "arras", arrasDepositAmount: 20000 });

    const found = await repo.getById(tx.id);
    expect(found?.stage).toBe("arras");
    expect(found?.arrasDepositAmount).toBe(20000);
  });

  test("updateDocumentStatus() changes a single document's status", async () => {
    const tx = await repo.createForOffer("offer-1", "listing-1", "owner-1", "buyer-1");
    await repo.updateDocumentStatus(tx.id, "nota_simple", "received");

    const found = await repo.getById(tx.id);
    const notaSimple = found?.documents.find((d) => d.key === "nota_simple");
    expect(notaSimple?.status).toBe("received");
    expect(found?.documents.find((d) => d.key === "ite")?.status).toBe("pending");
  });
});
