"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateTransactionAction,
  advanceStageAction,
  updateDocumentStatusAction,
  confirmDepositAsOwnerAction,
  confirmDepositAsBuyerAction,
} from "@/app/actions/transactions";
import { STAGE_LABELS, STAGE_ORDER, DOCUMENT_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/transactions/labels";
import type { Transaction, DocumentStatus, DepositStage } from "@/lib/transactions/types";

function DepositConfirmation({
  transactionId,
  stage,
  confirmedByOwner,
  confirmedByBuyer,
  isOwner,
  onChanged,
}: {
  transactionId: string;
  stage: DepositStage;
  confirmedByOwner: boolean;
  confirmedByBuyer: boolean;
  isOwner: boolean;
  onChanged: () => void;
}) {
  const [pending, setPending] = useState(false);
  const myConfirmed = isOwner ? confirmedByOwner : confirmedByBuyer;

  async function confirm() {
    setPending(true);
    try {
      if (isOwner) await confirmDepositAsOwnerAction(transactionId, stage);
      else await confirmDepositAsBuyerAction(transactionId, stage);
      onChanged();
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontSize: 13 }}>
      <span className={confirmedByOwner ? "offer-status offer-status-accepted" : "offer-status offer-status-pending"}>
        Vlasnik {confirmedByOwner ? "potvrdio" : "nije potvrdio"}
      </span>
      <span className={confirmedByBuyer ? "offer-status offer-status-accepted" : "offer-status offer-status-pending"}>
        Kupac {confirmedByBuyer ? "potvrdio" : "nije potvrdio"}
      </span>
      {!myConfirmed && (
        <button
          className="btn btn-secondary"
          style={{ padding: "6px 12px", fontSize: 12 }}
          disabled={pending}
          onClick={confirm}
        >
          {isOwner ? "Potvrdi da si primio/la depozit van platforme" : "Potvrdi da si uplatio/la depozit van platforme"}
        </button>
      )}
    </div>
  );
}

export function TransactionView({
  transaction,
  listingTitle,
  isOwner,
}: {
  transaction: Transaction;
  listingTitle: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [reservationDeposit, setReservationDeposit] = useState(
    transaction.reservationDepositAmount?.toString() ?? "",
  );
  const [reservationDeadline, setReservationDeadline] = useState(transaction.reservationDeadline ?? "");
  const [arrasDeposit, setArrasDeposit] = useState(transaction.arrasDepositAmount?.toString() ?? "");
  const [arrasDate, setArrasDate] = useState(transaction.arrasSigningDate ?? "");
  const [notaryDate, setNotaryDate] = useState(transaction.notaryDate ?? "");

  const currentStageIndex = STAGE_ORDER.indexOf(transaction.stage);
  const nextStage = STAGE_ORDER[currentStageIndex + 1];

  async function saveFields() {
    setPending(true);
    try {
      await updateTransactionAction(transaction.id, {
        reservationDepositAmount: reservationDeposit ? Number(reservationDeposit) : undefined,
        reservationDeadline: reservationDeadline || undefined,
        arrasDepositAmount: arrasDeposit ? Number(arrasDeposit) : undefined,
        arrasSigningDate: arrasDate || undefined,
        notaryDate: notaryDate || undefined,
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function goToNextStage() {
    if (!nextStage) return;
    setPending(true);
    try {
      await advanceStageAction(transaction.id, nextStage);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function setDocStatus(key: Transaction["documents"][number]["key"], status: DocumentStatus) {
    await updateDocumentStatusAction(transaction.id, key, status);
    router.refresh();
  }

  return (
    <div className="wrap section" style={{ maxWidth: 720 }}>
      <Link href={`/listing/${transaction.listingId}`} className="breadcrumb">
        ← {listingTitle}
      </Link>

      <div className="legal-warning">
        <h3>Pre nego što bilo šta potpišeš</h3>
        <p>
          <strong>Konsultuj advokata za nekretnine PRE potpisivanja</strong> — i rezervacionog ugovora i Arras-a,
          ne posle. Malo advokata je spremno da rešava probleme kad je nešto već potpisano.
        </p>
        <ul>
          <li>Standardna tarifa u Valensiji je ~1% cene stana + IVA. Jeftinija ponuda je razlog za oprez.</li>
          <li>
            Notari u Španiji NE proveravaju probleme nastale posle kupovine (rušenje, nelegalni priključci,
            VPO ograničenja) — to je posao advokata, ne notara.
          </li>
          <li>Advokat treba da pribavi i pregleda sve dokumente iz liste ispod pre potpisivanja Arras-a.</li>
        </ul>
        <p>
          <strong>ProSparrow ne generiše ugovore niti procesira uplate.</strong> Rezervacija i Arras se
          potpisuju direktno između vas dvoje, van platforme — ovo je samo tracker procesa.
        </p>
      </div>

      <div className="stage-stepper">
        {STAGE_ORDER.map((stage, i) => (
          <div
            key={stage}
            className={`stage-step${stage === transaction.stage ? " active" : ""}${i < currentStageIndex ? " done" : ""}`}
          >
            {STAGE_LABELS[stage]}
          </div>
        ))}
      </div>

      <div className="tx-card">
        <h2>Rezervacija</h2>
        <div className="form-grid">
          <div className="form-field-block">
            <label>Depozit (€, obično 1.000–2.000)</label>
            <input
              type="number"
              min={0}
              value={reservationDeposit}
              disabled={!isOwner}
              onChange={(e) => setReservationDeposit(e.target.value)}
            />
          </div>
          <div className="form-field-block">
            <label>Rok za odgovor vlasnika</label>
            <input
              type="date"
              value={reservationDeadline}
              disabled={!isOwner}
              onChange={(e) => setReservationDeadline(e.target.value)}
            />
          </div>
        </div>
        <DepositConfirmation
          transactionId={transaction.id}
          stage="reservation"
          confirmedByOwner={transaction.reservationDepositConfirmedByOwner}
          confirmedByBuyer={transaction.reservationDepositConfirmedByBuyer}
          isOwner={isOwner}
          onChanged={() => router.refresh()}
        />
      </div>

      <div className="tx-card">
        <h2>Arras</h2>
        <div className="form-grid">
          <div className="form-field-block">
            <label>Depozit (€, obično 10% cene)</label>
            <input
              type="number"
              min={0}
              value={arrasDeposit}
              disabled={!isOwner}
              onChange={(e) => setArrasDeposit(e.target.value)}
            />
          </div>
          <div className="form-field-block">
            <label>Datum potpisivanja</label>
            <input
              type="date"
              value={arrasDate}
              disabled={!isOwner}
              onChange={(e) => setArrasDate(e.target.value)}
            />
          </div>
        </div>
        <DepositConfirmation
          transactionId={transaction.id}
          stage="arras"
          confirmedByOwner={transaction.arrasDepositConfirmedByOwner}
          confirmedByBuyer={transaction.arrasDepositConfirmedByBuyer}
          isOwner={isOwner}
          onChanged={() => router.refresh()}
        />
      </div>

      <div className="tx-card">
        <h2>Notar</h2>
        <div className="form-field-block">
          <label>Datum zakazanog termina</label>
          <input
            type="date"
            value={notaryDate}
            disabled={!isOwner}
            onChange={(e) => setNotaryDate(e.target.value)}
          />
        </div>
      </div>

      {isOwner && (
        <button className="btn btn-primary" disabled={pending} onClick={saveFields} style={{ marginBottom: 20 }}>
          {pending ? "Čuvam…" : "Sačuvaj izmene"}
        </button>
      )}

      <div className="tx-card">
        <h2>Dokumenti</h2>
        <div className="doc-checklist">
          {transaction.documents.map((doc) => (
            <div key={doc.key} className="doc-item">
              <div>
                <div className="doc-item-label">{DOCUMENT_LABELS[doc.key].title}</div>
                <div className="doc-item-hint">{DOCUMENT_LABELS[doc.key].hint}</div>
              </div>
              {isOwner ? (
                <select
                  className="doc-status-select"
                  value={doc.status}
                  onChange={(e) => setDocStatus(doc.key, e.target.value as DocumentStatus)}
                >
                  {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="doc-item-hint">{DOCUMENT_STATUS_LABELS[doc.status]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOwner && nextStage && transaction.stage !== "completed" && transaction.stage !== "cancelled" && (
        <button className="btn btn-secondary" disabled={pending} onClick={goToNextStage}>
          Pređi na sledeću fazu: {STAGE_LABELS[nextStage]}
        </button>
      )}
    </div>
  );
}
