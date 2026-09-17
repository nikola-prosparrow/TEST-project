"use server";

import { redirect } from "next/navigation";
import { getListingsRepository } from "@/lib/listings";
import type { ListingType, PropertyType, PricePeriod } from "@/lib/listings/types";
import { getCurrentUser } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";
import { upsertPhone } from "@/lib/profiles";
import { uploadListingPhotos } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type CreateListingActionState = { error: string | null };

const LISTING_TYPES: ListingType[] = ["sale", "rent"];
const PROPERTY_TYPES: PropertyType[] = ["apartment", "house", "studio", "penthouse", "land", "commercial"];

// Anti-spam: cap how many listings one account can post in a rolling 24h window (TD10).
const MAX_LISTINGS_PER_DAY = 5;
const MAX_PHOTOS = 8;

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

  const repo = await getListingsRepository();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await repo.countRecentByOwner(user.id, since);
  if (recentCount >= MAX_LISTINGS_PER_DAY) {
    return {
      error: `Dostigao/la si dnevni limit od ${MAX_LISTINGS_PER_DAY} oglasa. Pokušaj ponovo za 24h.`,
    };
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
  const phone = str(formData, "phone");
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

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
  if (photos.length > MAX_PHOTOS) {
    return { error: `Najviše ${MAX_PHOTOS} fotografija po oglasu.` };
  }

  const geocoded = await geocodeAddress(`${address}, ${city}`);

  if (phone) {
    await upsertPhone(user.id, phone);
  }

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
      lat: geocoded?.lat,
      lng: geocoded?.lng,
    },
    user.id,
  );

  if (photos.length > 0 && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const paths = await uploadListingPhotos(supabase, user.id, listing.id, photos);
    await repo.updatePhotos(listing.id, paths);
  }

  redirect(`/listing/${listing.id}`);
}
