"use client";

import { useActionState, useState } from "react";
import { createOfferAction, type CreateOfferActionState } from "@/app/actions/offers";

const INITIAL_STATE: CreateOfferActionState = { error: null, sent: false };

export function OfferForm({
  listingId,
  ownerId,
  defaultEmail,
}: {
  listingId: string;
  ownerId: string;
  defaultEmail: string;
}) {
  const [state, formAction, pending] = useActionState(createOfferAction, INITIAL_STATE);
  const [open, setOpen] = useState(false);

  if (state.sent) {
    return (
      <div className="sidebar-card">
        <div className="auth-success">
          Ponuda je poslata vlasniku. Prati status u <a href="/moj-nalog">Moj nalog</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-card">
      <div className="sidebar-price" style={{ fontSize: 18 }}>
        Napravi ponudu
      </div>
      <p className="sub" style={{ marginBottom: 16 }}>
        Vlasnik vidi sve ponude i bira najbolju — bez posrednika.
      </p>

      {open ? (
        <form action={formAction}>
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="ownerId" value={ownerId} />

          {state.error && <div className="auth-error">{state.error}</div>}

          <div className="form-field-block">
            <label htmlFor="bidderName">Ime</label>
            <input id="bidderName" name="bidderName" type="text" required />
          </div>
          <div className="form-field-block">
            <label htmlFor="amount">Iznos ponude (€)</label>
            <input id="amount" name="amount" type="number" min={1} required />
          </div>
          <div className="form-field-block">
            <label htmlFor="message">Poruka (opciono)</label>
            <textarea id="message" name="message" placeholder="Uslovi, rok, dodatne napomene…" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
            {pending ? "Šaljem…" : "Pošalji ponudu"}
          </button>
          <div className="text-sm text-zinc-500" style={{ marginTop: 4 }}>
            Prijavljen/na kao {defaultEmail}
          </div>
        </form>
      ) : (
        <button className="btn btn-secondary btn-block" onClick={() => setOpen(true)}>
          Napravi ponudu
        </button>
      )}
    </div>
  );
}
