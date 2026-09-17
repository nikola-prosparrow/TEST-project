export type ListingType = "sale" | "rent";
export type PropertyType = "apartment" | "house" | "studio" | "penthouse" | "land" | "commercial";
export type PricePeriod = "total" | "monthly";

export type Listing = {
  id: string;
  ownerId: string;
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  city: string;
  address: string;
  price: number;
  currency: string;
  pricePeriod: PricePeriod;
  areaSqm: number;
  rooms: number;
  bathrooms: number;
  floor: string | null;
  yearBuilt: string | null;
  description: string;
  features: string[];
  verified: boolean;
  lat: number | null;
  lng: number | null;
  photoPaths: string[];
  bestFinalDeadline: string | null;
  createdAt: string;
};

export type ListingFilters = {
  city?: string;
  propertyType?: PropertyType;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
};

export type CreateListingInput = {
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  city: string;
  address: string;
  price: number;
  pricePeriod: PricePeriod;
  areaSqm: number;
  rooms: number;
  bathrooms: number;
  floor?: string;
  yearBuilt?: string;
  description: string;
  features?: string[];
  lat?: number;
  lng?: number;
};

export interface ListingsRepository {
  list(filters?: ListingFilters): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
  listByOwner(ownerId: string): Promise<Listing[]>;
  countRecentByOwner(ownerId: string, since: Date): Promise<number>;
  create(input: CreateListingInput, ownerId: string): Promise<Listing>;
  updatePhotos(id: string, photoPaths: string[]): Promise<void>;
  setBestFinalDeadline(id: string, deadline: string | null): Promise<void>;
}
