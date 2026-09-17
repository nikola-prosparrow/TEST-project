import { randomUUID } from "node:crypto";
import type { Listing, ListingFilters, ListingsRepository } from "./types";

const SEED_LISTINGS: Listing[] = [
  {
    id: "l1",
    ownerId: "seed-owner-1",
    title: "Svetao dvosoban stan",
    listingType: "sale",
    propertyType: "apartment",
    city: "Beograd",
    address: "Njegoševa 18, Vračar, Beograd",
    price: 189000,
    currency: "EUR",
    pricePeriod: "total",
    areaSqm: 64,
    rooms: 2,
    bathrooms: 1,
    floor: "3/6",
    yearBuilt: "2018.",
    description:
      "Svetao i funkcionalan dvosoban stan u srcu Vračara, u mirnoj ulici na par minuta od parka. Kompletno renoviran 2022. godine, sa novom stolarijom i podnim grejanjem u kupatilu. Prostrana terasa gleda na unutrašnje dvorište.",
    features: ["Podno grejanje", "Terasa", "Lift", "Parking mesto", "Klima uređaj", "Nameštaj"],
    verified: true,
    lat: 44.7995,
    lng: 20.4778,
    photoPaths: [],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "l2",
    ownerId: "seed-owner-2",
    title: "Porodična kuća sa dvorištem",
    listingType: "sale",
    propertyType: "house",
    city: "Beograd",
    address: "Cara Dušana 42, Zemun, Beograd",
    price: 245000,
    currency: "EUR",
    pricePeriod: "total",
    areaSqm: 180,
    rooms: 4,
    bathrooms: 2,
    floor: "Prizemlje + sprat",
    yearBuilt: "2015.",
    description:
      "Prostrana porodična kuća u mirnom delu Zemuna, sa ograđenim dvorištem i garažom za dva vozila. Dnevni boravak povezan sa trpezarijom i kuhinjom, četiri spavaće sobe raspoređene na dve etaže.",
    features: ["Dvorište", "Garaža", "Podrum", "Terasa", "Klima uređaj", "Nameštaj"],
    verified: true,
    lat: 44.843,
    lng: 20.4013,
    photoPaths: [],
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "l3",
    ownerId: "seed-owner-3",
    title: "Moderna garsonjera",
    listingType: "rent",
    propertyType: "studio",
    city: "Novi Sad",
    address: "Zmaj Jovina 5, Centar, Novi Sad",
    price: 520,
    currency: "EUR",
    pricePeriod: "monthly",
    areaSqm: 32,
    rooms: 1,
    bathrooms: 1,
    floor: "2/4",
    yearBuilt: "2020.",
    description:
      "Moderno opremljena garsonjera u samom centru Novog Sada, na par minuta hoda od Zmaj Jovine ulice i fakulteta. Kompletno opremljena kuhinja, brz internet i klima uređaj.",
    features: ["Nameštaj", "Klima uređaj", "Internet uključen", "Veš mašina", "Lift", "Blizina fakulteta"],
    verified: false,
    lat: 45.2551,
    lng: 19.8452,
    photoPaths: [],
    createdAt: "2026-01-14T00:00:00.000Z",
  },
  {
    id: "l4",
    ownerId: "seed-owner-4",
    title: "Penthouse sa terasom",
    listingType: "sale",
    propertyType: "penthouse",
    city: "Beograd",
    address: "Bulevar Zorana Đinđića 100, Novi Beograd",
    price: 310000,
    currency: "EUR",
    pricePeriod: "total",
    areaSqm: 112,
    rooms: 3,
    bathrooms: 2,
    floor: "12/12 (penthouse)",
    yearBuilt: "2021.",
    description:
      "Luksuzni penthouse na poslednjem spratu, sa panoramskim pogledom na grad i velikom terasom. Otvoren dnevni prostor, dve garderobe i podno grejanje u celom stanu.",
    features: ["Terasa", "Panoramski pogled", "Lift", "Parking mesto", "Klima uređaj", "Podno grejanje"],
    verified: true,
    lat: 44.8125,
    lng: 20.411,
    photoPaths: [],
    createdAt: "2026-01-16T00:00:00.000Z",
  },
];

function matches(listing: Listing, filters?: ListingFilters): boolean {
  if (!filters) return true;
  if (filters.city && !listing.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
  if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
  if (filters.listingType && listing.listingType !== filters.listingType) return false;
  if (filters.minPrice !== undefined && listing.price < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && listing.price > filters.maxPrice) return false;
  return true;
}

export function createInMemoryRepository(): ListingsRepository {
  const listings: Listing[] = [...SEED_LISTINGS];

  return {
    async list(filters) {
      return listings.filter((listing) => matches(listing, filters));
    },

    async getById(id) {
      return listings.find((listing) => listing.id === id) ?? null;
    },

    async listByOwner(ownerId) {
      return listings.filter((listing) => listing.ownerId === ownerId);
    },

    async countRecentByOwner(ownerId, since) {
      return listings.filter(
        (listing) => listing.ownerId === ownerId && new Date(listing.createdAt) >= since,
      ).length;
    },

    async create(input, ownerId) {
      const listing: Listing = {
        id: randomUUID(),
        ownerId,
        title: input.title,
        listingType: input.listingType,
        propertyType: input.propertyType,
        city: input.city,
        address: input.address,
        price: input.price,
        currency: "EUR",
        pricePeriod: input.pricePeriod,
        areaSqm: input.areaSqm,
        rooms: input.rooms,
        bathrooms: input.bathrooms,
        floor: input.floor ?? null,
        yearBuilt: input.yearBuilt ?? null,
        description: input.description,
        features: input.features ?? [],
        verified: false,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        photoPaths: [],
        createdAt: new Date().toISOString(),
      };
      listings.push(listing);
      return listing;
    },

    async updatePhotos(id, photoPaths) {
      const listing = listings.find((l) => l.id === id);
      if (listing) listing.photoPaths = photoPaths;
    },
  };
}
