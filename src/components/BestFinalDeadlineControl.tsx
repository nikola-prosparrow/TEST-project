"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setBestFinalDeadlineAction } from "@/app/actions/bestFinal";

export function BestFinalDeadlineControl({
  listingId,
  currentDeadline,
}: {
  listingId: string;
  currentDeadline: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentDeadline ? currentDeadline.slice(0, 10) : "");
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    try {
      await setBestFinalDeadlineAction(listingId, value ? new Date(value).toISOString() : null);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="tx-card">
      <h2 style={{ fontSize: 15 }}>Best-and-final rok (opciono)</h2>
      <p className="sub" style={{ marginBottom: 12 }}>
        Postavi rok do kog svi zainteresovani mogu da pošalju finalnu ponudu. Prikazuje se svima na oglasu.
      </p>
      <div className="form-grid">
        <div className="form-field-block">
          <label>Rok</label>
          <input type="date" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-secondary" disabled={pending} onClick={save} style={{ padding: "8px 16px", fontSize: 13 }}>
        {pending ? "Čuvam…" : currentDeadline ? "Ažuriraj / ukloni rok" : "Postavi rok"}
      </button>
    </div>
  );
}
