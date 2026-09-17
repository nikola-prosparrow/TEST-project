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
};

export interface ListingsRepository {
  list(filters?: ListingFilters): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
  create(input: CreateListingInput, ownerId: string): Promise<Listing>;
}
