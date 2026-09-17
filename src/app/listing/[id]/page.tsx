import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListing, listings } from "@/data/listings";
import { ListingDetail } from "@/components/ListingDetail";

export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return {};

  return {
    title: `${listing.title} — ${listing.addr} | ProSparrow`,
    description: `${listing.title}, ${listing.detail.fullAddress}. ${listing.area}, ${listing.beds} soba, ${listing.price}.`,
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  return <ListingDetail listing={listing} />;
}
