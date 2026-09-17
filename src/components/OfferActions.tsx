"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOfferStatusAction } from "@/app/actions/offers";
import type { OfferStatus } from "@/lib/offers/types";

export function OfferActions({ offerId }: { offerId: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function setStatus(status: OfferStatus) {
    setPending(true);
    try {
      await updateOfferStatusAction(offerId, status);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <button
        className="btn btn-primary"
        style={{ padding: "8px 16px", fontSize: 13 }}
        disabled={pending}
        onClick={() => setStatus("accepted")}
      >
        Prihvati
      </button>
      <button
        className="btn btn-secondary"
        style={{ padding: "8px 16px", fontSize: 13 }}
        disabled={pending}
        onClick={() => setStatus("rejected")}
      >
        Odbij
      </button>
    </div>
  );
}
