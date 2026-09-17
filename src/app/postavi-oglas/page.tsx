import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CreateListingForm } from "@/components/CreateListingForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Postavi oglas | ProSparrow" };

export default async function CreateListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  return (
    <div>
      <SiteHeader user={user} />
      <CreateListingForm />
      <SiteFooter />
    </div>
  );
}
