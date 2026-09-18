"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string | null };

const NOT_CONFIGURED_ERROR =
  "Nalozi trenutno nisu dostupni (Supabase nije podešen u ovom okruženju).";

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: NOT_CONFIGURED_ERROR };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Unesi email i lozinku." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Potvrdi email adresu (link smo ti poslali) pre prijave." };
    }
    return { error: "Pogrešan email ili lozinka." };
  }

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: NOT_CONFIGURED_ERROR };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Unesi email i lozinku." };
  }
  if (password.length < 8) {
    return { error: "Lozinka mora imati bar 8 karaktera." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/prijava?registrovan=1");
}

export async function signOutAction() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
