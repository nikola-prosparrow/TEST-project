"use client";

import { useActionState, useState } from "react";
import { sendMessageAction, type SendMessageActionState } from "@/app/actions/messages";

const INITIAL_STATE: SendMessageActionState = { error: null, sent: false };
const VIEWING_PREFILL =
  "Zdravo, zainteresovan/a sam za razgledanje ove nekretnine. Kada bi Vam odgovaralo?";

export function ContactOwnerForm({
  listingId,
  ownerId,
  ownerPhone,
}: {
  listingId: string;
  ownerId: string;
  ownerPhone: string | null;
}) {
  const [state, formAction, pending] = useActionState(sendMessageAction, INITIAL_STATE);
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  const [showPhone, setShowPhone] = useState(false);

  if (state.sent) {
    return <div className="auth-success">Poruka je poslata vlasniku.</div>;
  }

  return (
    <div>
      {open ? (
        <form action={formAction}>
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="ownerId" value={ownerId} />

          {state.error && <div className="auth-error">{state.error}</div>}

          <div className="form-field-block">
            <label htmlFor="senderName">Ime</label>
            <input id="senderName" name="senderName" type="text" required />
          </div>
          <div className="form-field-block">
            <label htmlFor="senderEmail">Email</label>
            <input id="senderEmail" name="senderEmail" type="email" required />
          </div>
          <div className="form-field-block">
            <label htmlFor="senderPhone">Telefon (opciono)</label>
            <input id="senderPhone" name="senderPhone" type="tel" />
          </div>
          <div className="form-field-block">
            <label htmlFor="body">Poruka</label>
            <textarea id="body" name="body" key={prefill} defaultValue={prefill} required minLength={10} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
            {pending ? "Šaljem…" : "Pošalji poruku"}
          </button>
        </form>
      ) : (
        <>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setPrefill("");
              setOpen(true);
            }}
          >
            Pošalji poruku vlasniku
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => {
              setPrefill(VIEWING_PREFILL);
              setOpen(true);
            }}
          >
            Zakaži razgledanje
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => setShowPhone(true)}>
            {showPhone ? ownerPhone ?? "Vlasnik nije uneo broj telefona" : "Prikaži broj telefona"}
          </button>
        </>
      )}
    </div>
  );
}
