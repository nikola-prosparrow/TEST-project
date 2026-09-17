import type { Listing } from "@/lib/listings/types";

export function formatPrice(listing: Pick<Listing, "price" | "currency" | "pricePeriod">): string {
  const amount = new Intl.NumberFormat("sr-RS").format(listing.price);
  const symbol = listing.currency === "EUR" ? "€" : listing.currency;
  const base = `${symbol}${amount}`;
  return listing.pricePeriod === "monthly" ? `${base} / mesečno` : base;
}

export function formatPricePerArea(listing: Pick<Listing, "price" | "currency" | "pricePeriod" | "areaSqm">): string {
  if (listing.pricePeriod === "monthly") {
    return `Depozit: ${formatPrice(listing)}`;
  }
  const perSqm = Math.round(listing.price / listing.areaSqm);
  const symbol = listing.currency === "EUR" ? "€" : listing.currency;
  return `≈ ${symbol}${new Intl.NumberFormat("sr-RS").format(perSqm)} / m²`;
}
