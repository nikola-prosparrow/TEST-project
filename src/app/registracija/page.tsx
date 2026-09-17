import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthForm } from "@/components/AuthForm";
import { signUpAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Registracija | ProSparrow" };

export default async function SignUpPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <SiteHeader showSaved={false} user={user} />
      <AuthForm mode="signup" action={signUpAction} />
      <SiteFooter />
    </div>
  );
}
