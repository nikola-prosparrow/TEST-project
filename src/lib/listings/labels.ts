import type { ListingType, PropertyType } from "./types";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Stan",
  house: "Kuća",
  studio: "Garsonjera",
  penthouse: "Penthouse",
  land: "Zemljište",
  commercial: "Poslovni prostor",
};

export const PROPERTY_TYPE_CHIP_LABELS: Record<PropertyType, string> = {
  apartment: "Stanovi",
  house: "Kuće",
  studio: "Garsonjere",
  penthouse: "Luksuzno",
  land: "Zemljište",
  commercial: "Poslovni prostor",
};

export function listingKicker(listingType: ListingType, propertyType: PropertyType): string {
  const noun = PROPERTY_TYPE_LABELS[propertyType];
  return listingType === "rent" ? `${noun} za izdavanje` : `${noun} na prodaju`;
}
