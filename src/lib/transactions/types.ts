export type TransactionStage = "reservation" | "arras" | "notary" | "completed" | "cancelled";
export type DocumentKey = "nota_simple" | "cedula_habitabilidad" | "ite" | "cee" | "deuda_cero" | "vpo_check";
export type DocumentStatus = "pending" | "requested" | "received" | "not_applicable";
export type DepositStage = "reservation" | "arras";

export const DOCUMENT_KEYS: DocumentKey[] = [
  "nota_simple",
  "cedula_habitabilidad",
  "ite",
  "cee",
  "deuda_cero",
  "vpo_check",
];

export type TransactionDocument = {
  key: DocumentKey;
  status: DocumentStatus;
};

export type Transaction = {
  id: string;
  listingId: string;
  offerId: string;
  ownerId: string;
  buyerId: string;
  stage: TransactionStage;
  reservationDepositAmount: number | null;
  reservationDeadline: string | null;
  reservationDepositConfirmedByOwner: boolean;
  reservationDepositConfirmedByBuyer: boolean;
  arrasDepositAmount: number | null;
  arrasSigningDate: string | null;
  arrasDepositConfirmedByOwner: boolean;
  arrasDepositConfirmedByBuyer: boolean;
  notaryDate: string | null;
  documents: TransactionDocument[];
  createdAt: string;
};

export type UpdateTransactionInput = Partial<{
  stage: TransactionStage;
  reservationDepositAmount: number;
  reservationDeadline: string;
  reservationDepositConfirmedByOwner: boolean;
  arrasDepositAmount: number;
  arrasSigningDate: string;
  arrasDepositConfirmedByOwner: boolean;
  notaryDate: string;
}>;

export interface TransactionsRepository {
  createForOffer(offerId: string, listingId: string, ownerId: string, buyerId: string): Promise<Transaction>;
  getById(id: string): Promise<Transaction | null>;
  getByOfferId(offerId: string): Promise<Transaction | null>;
  listByUser(userId: string): Promise<Transaction[]>;
  update(id: string, input: UpdateTransactionInput): Promise<void>;
  updateDocumentStatus(transactionId: string, key: DocumentKey, status: DocumentStatus): Promise<void>;
  confirmDepositAsBuyer(transactionId: string, stage: DepositStage): Promise<void>;
}
