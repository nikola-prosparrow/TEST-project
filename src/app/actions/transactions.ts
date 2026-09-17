"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getTransactionsRepository } from "@/lib/transactions";
import type {
  DepositStage,
  DocumentKey,
  DocumentStatus,
  TransactionStage,
  UpdateTransactionInput,
} from "@/lib/transactions/types";

async function assertOwner(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const repo = await getTransactionsRepository();
  const transaction = await repo.getById(transactionId);
  if (!transaction || transaction.ownerId !== user.id) {
    throw new Error("Not authorized");
  }
  return { repo, transaction };
}

export async function updateTransactionAction(
  transactionId: string,
  input: UpdateTransactionInput,
): Promise<void> {
  const { repo } = await assertOwner(transactionId);
  await repo.update(transactionId, input);
  revalidatePath(`/transakcija/${transactionId}`);
}

export async function advanceStageAction(transactionId: string, stage: TransactionStage): Promise<void> {
  const { repo } = await assertOwner(transactionId);
  await repo.update(transactionId, { stage });
  revalidatePath(`/transakcija/${transactionId}`);
}

export async function updateDocumentStatusAction(
  transactionId: string,
  key: DocumentKey,
  status: DocumentStatus,
): Promise<void> {
  const { repo } = await assertOwner(transactionId);
  await repo.updateDocumentStatus(transactionId, key, status);
  revalidatePath(`/transakcija/${transactionId}`);
}

export async function confirmDepositAsOwnerAction(transactionId: string, stage: DepositStage): Promise<void> {
  const { repo } = await assertOwner(transactionId);
  await repo.update(
    transactionId,
    stage === "reservation"
      ? { reservationDepositConfirmedByOwner: true }
      : { arrasDepositConfirmedByOwner: true },
  );
  revalidatePath(`/transakcija/${transactionId}`);
}

export async function confirmDepositAsBuyerAction(transactionId: string, stage: DepositStage): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const repo = await getTransactionsRepository();
  const transaction = await repo.getById(transactionId);
  if (!transaction || transaction.buyerId !== user.id) {
    throw new Error("Not authorized");
  }

  await repo.confirmDepositAsBuyer(transactionId, stage);
  revalidatePath(`/transakcija/${transactionId}`);
}
