import { randomUUID } from "node:crypto";
import { DOCUMENT_KEYS } from "./types";
import type { Transaction, TransactionsRepository } from "./types";

export function createInMemoryTransactionsRepository(): TransactionsRepository {
  const transactions: Transaction[] = [];

  return {
    async createForOffer(offerId, listingId, ownerId, buyerId) {
      const tx: Transaction = {
        id: randomUUID(),
        listingId,
        offerId,
        ownerId,
        buyerId,
        stage: "reservation",
        reservationDepositAmount: null,
        reservationDeadline: null,
        reservationDepositConfirmedByOwner: false,
        reservationDepositConfirmedByBuyer: false,
        arrasDepositAmount: null,
        arrasSigningDate: null,
        arrasDepositConfirmedByOwner: false,
        arrasDepositConfirmedByBuyer: false,
        notaryDate: null,
        documents: DOCUMENT_KEYS.map((key) => ({ key, status: "pending" as const })),
        createdAt: new Date().toISOString(),
      };
      transactions.push(tx);
      return tx;
    },

    async getById(id) {
      return transactions.find((t) => t.id === id) ?? null;
    },

    async getByOfferId(offerId) {
      return transactions.find((t) => t.offerId === offerId) ?? null;
    },

    async listByUser(userId) {
      return transactions.filter((t) => t.ownerId === userId || t.buyerId === userId);
    },

    async update(id, input) {
      const tx = transactions.find((t) => t.id === id);
      if (!tx) return;
      if (input.stage !== undefined) tx.stage = input.stage;
      if (input.reservationDepositAmount !== undefined) tx.reservationDepositAmount = input.reservationDepositAmount;
      if (input.reservationDeadline !== undefined) tx.reservationDeadline = input.reservationDeadline;
      if (input.reservationDepositConfirmedByOwner !== undefined)
        tx.reservationDepositConfirmedByOwner = input.reservationDepositConfirmedByOwner;
      if (input.arrasDepositAmount !== undefined) tx.arrasDepositAmount = input.arrasDepositAmount;
      if (input.arrasSigningDate !== undefined) tx.arrasSigningDate = input.arrasSigningDate;
      if (input.arrasDepositConfirmedByOwner !== undefined)
        tx.arrasDepositConfirmedByOwner = input.arrasDepositConfirmedByOwner;
      if (input.notaryDate !== undefined) tx.notaryDate = input.notaryDate;
    },

    async updateDocumentStatus(transactionId, key, status) {
      const tx = transactions.find((t) => t.id === transactionId);
      const doc = tx?.documents.find((d) => d.key === key);
      if (doc) doc.status = status;
    },

    async confirmDepositAsBuyer(transactionId, stage) {
      const tx = transactions.find((t) => t.id === transactionId);
      if (!tx) return;
      if (stage === "reservation") tx.reservationDepositConfirmedByBuyer = true;
      if (stage === "arras") tx.arrasDepositConfirmedByBuyer = true;
    },
  };
}
