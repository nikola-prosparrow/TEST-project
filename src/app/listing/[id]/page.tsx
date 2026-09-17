import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingsRepository } from "@/lib/listings";
import { ListingDetail } from "@/components/ListingDetail";
import { formatPrice } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const repo = await getListingsRepository();
  const listing = await repo.getById(id);
  if (!listing) return {};

  return {
    title: `${listing.title} — ${listing.city} | ProSparrow`,
    description: `${listing.title}, ${listing.address}. ${listing.areaSqm} m², ${listing.rooms} soba, ${formatPrice(listing)}.`,
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = await getListingsRepository();
  const [listing, user] = await Promise.all([repo.getById(id), getCurrentUser()]);
  if (!listing) notFound();

  return <ListingDetail listing={listing} user={user} />;
}
