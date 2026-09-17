import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { TransactionView } from "@/components/TransactionView";
import { getCurrentUser } from "@/lib/auth";
import { getTransactionsRepository } from "@/lib/transactions";
import { getListingsRepository } from "@/lib/listings";

export const metadata: Metadata = { title: "Transakcija | ProSparrow" };

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent(`/transakcija/${id}`)}`);

  const transactionsRepo = await getTransactionsRepository();
  const transaction = await transactionsRepo.getById(id);
  if (!transaction) notFound();
  if (transaction.ownerId !== user.id && transaction.buyerId !== user.id) notFound();

  const listingsRepo = await getListingsRepository();
  const listing = await listingsRepo.getById(transaction.listingId);

  return (
    <div>
      <SiteHeader user={user} />
      <TransactionView
        transaction={transaction}
        listingTitle={listing?.title ?? "Oglas"}
        isOwner={transaction.ownerId === user.id}
      />
      <SiteFooter />
      <MobileTabBar initialActive="profile" />
    </div>
  );
}
