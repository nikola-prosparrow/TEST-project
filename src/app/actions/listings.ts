"use server";

import { redirect } from "next/navigation";
import { getListingsRepository } from "@/lib/listings";
import type { ListingType, PropertyType, PricePeriod } from "@/lib/listings/types";
import { getCurrentUser } from "@/lib/auth";

export type CreateListingActionState = { error: string | null };

const LISTING_TYPES: ListingType[] = ["sale", "rent"];
const PROPERTY_TYPES: PropertyType[] = ["apartment", "house", "studio", "penthouse", "land", "commercial"];

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string): number {
  return Number(formData.get(key));
}

export async function createListingAction(
  _prevState: CreateListingActionState,
  formData: FormData,
): Promise<CreateListingActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Moraš biti prijavljen/na da bi postavio/la oglas." };
  }

  const title = str(formData, "title");
  const listingType = str(formData, "listingType") as ListingType;
  const propertyType = str(formData, "propertyType") as PropertyType;
  const city = str(formData, "city");
  const address = str(formData, "address");
  const price = num(formData, "price");
  const pricePeriod: PricePeriod = listingType === "rent" ? "monthly" : "total";
  const areaSqm = num(formData, "areaSqm");
  const rooms = num(formData, "rooms");
  const bathrooms = num(formData, "bathrooms");
  const floor = str(formData, "floor");
  const yearBuilt = str(formData, "yearBuilt");
  const description = str(formData, "description");

  if (!title || title.length < 5) {
    return { error: "Naslov mora imati bar 5 karaktera." };
  }
  if (!LISTING_TYPES.includes(listingType)) {
    return { error: "Izaberi da li prodaješ ili izdaješ." };
  }
  if (!PROPERTY_TYPES.includes(propertyType)) {
    return { error: "Izaberi tip nekretnine." };
  }
  if (!city) {
    return { error: "Unesi grad." };
  }
  if (!address) {
    return { error: "Unesi adresu." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Cena mora biti pozitivan broj." };
  }
  if (!Number.isFinite(areaSqm) || areaSqm <= 0) {
    return { error: "Površina mora biti pozitivan broj." };
  }
  if (!Number.isInteger(rooms) || rooms < 0) {
    return { error: "Broj soba nije validan." };
  }
  if (!Number.isInteger(bathrooms) || bathrooms < 0) {
    return { error: "Broj kupatila nije validan." };
  }
  if (!description || description.length < 20) {
    return { error: "Opis mora imati bar 20 karaktera." };
  }

  const repo = await getListingsRepository();
  const listing = await repo.create(
    {
      title,
      listingType,
      propertyType,
      city,
      address,
      price,
      pricePeriod,
      areaSqm,
      rooms,
      bathrooms,
      floor: floor || undefined,
      yearBuilt: yearBuilt || undefined,
      description,
    },
    user.id,
  );

  redirect(`/listing/${listing.id}`);
}
