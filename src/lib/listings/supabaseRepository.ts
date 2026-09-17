import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateListingInput, Listing, ListingFilters, ListingsRepository } from "./types";

type ListingRow = {
  id: string;
  owner_id: string;
  title: string;
  listing_type: Listing["listingType"];
  property_type: Listing["propertyType"];
  city: string;
  address: string;
  price: number;
  currency: string;
  price_period: Listing["pricePeriod"];
  area_sqm: number;
  rooms: number;
  bathrooms: number;
  floor: string | null;
  year_built: string | null;
  description: string;
  features: string[];
  verified: boolean;
  created_at: string;
};

function fromRow(row: ListingRow): Listing {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    listingType: row.listing_type,
    propertyType: row.property_type,
    city: row.city,
    address: row.address,
    price: row.price,
    currency: row.currency,
    pricePeriod: row.price_period,
    areaSqm: row.area_sqm,
    rooms: row.rooms,
    bathrooms: row.bathrooms,
    floor: row.floor,
    yearBuilt: row.year_built,
    description: row.description,
    features: row.features ?? [],
    verified: row.verified,
    createdAt: row.created_at,
  };
}

export function createSupabaseRepository(supabase: SupabaseClient): ListingsRepository {
  return {
    async list(filters?: ListingFilters) {
      let query = supabase.from("listings").select("*").order("created_at", { ascending: false });

      if (filters?.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters?.propertyType) query = query.eq("property_type", filters.propertyType);
      if (filters?.listingType) query = query.eq("listing_type", filters.listingType);
      if (filters?.minPrice !== undefined) query = query.gte("price", filters.minPrice);
      if (filters?.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);

      const { data, error } = await query;
      if (error) throw new Error(`Failed to list listings: ${error.message}`);
      return (data as ListingRow[]).map(fromRow);
    },

    async getById(id: string) {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(`Failed to fetch listing ${id}: ${error.message}`);
      return data ? fromRow(data as ListingRow) : null;
    },

    async create(input: CreateListingInput, ownerId: string) {
      const { data, error } = await supabase
        .from("listings")
        .insert({
          owner_id: ownerId,
          title: input.title,
          listing_type: input.listingType,
          property_type: input.propertyType,
          city: input.city,
          address: input.address,
          price: input.price,
          price_period: input.pricePeriod,
          area_sqm: input.areaSqm,
          rooms: input.rooms,
          bathrooms: input.bathrooms,
          floor: input.floor ?? null,
          year_built: input.yearBuilt ?? null,
          description: input.description,
          features: input.features ?? [],
        })
        .select("*")
        .single();

      if (error) throw new Error(`Failed to create listing: ${error.message}`);
      return fromRow(data as ListingRow);
    },
  };
}
