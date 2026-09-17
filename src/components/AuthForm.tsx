"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthActionState } from "@/app/actions/auth";

const INITIAL_STATE: AuthActionState = { error: null };

export function AuthForm({
  mode,
  action,
  successMessage,
  next,
}: {
  mode: "signin" | "signup";
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  successMessage?: string;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{mode === "signin" ? "Prijavi se" : "Napravi nalog"}</h1>
        <p className="sub">
          {mode === "signin"
            ? "Prijavi se da postaviš oglas ili upravljaš postojećim."
            : "Besplatno, treba ti samo email — bez agencija, bez provizije."}
        </p>

        {successMessage && <div className="auth-success">{successMessage}</div>}
        {state.error && <div className="auth-error">{state.error}</div>}

        <form action={formAction}>
          {next && <input type="hidden" name="next" value={next} />}
          <div className="form-field-block">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="form-field-block">
            <label htmlFor="password">Lozinka</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
            {pending ? "Sačekaj…" : mode === "signin" ? "Prijavi se" : "Napravi nalog"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signin" ? (
            <>
              Nemaš nalog? <Link href="/registracija">Napravi ga</Link>
            </>
          ) : (
            <>
              Već imaš nalog? <Link href="/prijava">Prijavi se</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
