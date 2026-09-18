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
  const next = typeof sp.next === "string" ? sp.next : undefined;

  return (
    <div>
      <SiteHeader user={user} />
      <AuthForm
        mode="signin"
        action={signInAction}
        successMessage={sp.registrovan ? "Uspešno si registrovan/na — sad se prijavi." : undefined}
        errorMessage={
          sp.potvrda === "neuspesna"
            ? "Link za potvrdu emaila nije važeći ili je istekao. Probaj da se prijaviš — ako je email već potvrđen, radiće."
            : undefined
        }
        next={next}
      />
      <SiteFooter />
    </div>
  );
}
