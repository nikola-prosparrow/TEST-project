import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthForm } from "@/components/AuthForm";
import { signInAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Prijava | ProSparrow" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  return (
    <div>
      <SiteHeader showSaved={false} user={user} />
      <AuthForm
        mode="signin"
        action={signInAction}
        successMessage={sp.registrovan ? "Uspešno si registrovan/na — sad se prijavi." : undefined}
      />
      <SiteFooter />
    </div>
  );
}
