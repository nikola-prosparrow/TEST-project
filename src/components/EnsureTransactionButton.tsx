"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureTransactionForOfferAction } from "@/app/actions/offers";

export function EnsureTransactionButton({ offerId }: { offerId: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function create() {
    setPending(true);
    try {
      const { transactionId } = await ensureTransactionForOfferAction(offerId);
      if (transactionId) router.push(`/transakcija/${transactionId}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className="btn btn-secondary"
      style={{ padding: "8px 16px", fontSize: 13, marginTop: 10 }}
      disabled={pending}
      onClick={create}
    >
      {pending ? "Kreiram…" : "Kreiraj transakciju"}
    </button>
  );
}
