import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryRepository } from "../src/lib/listings/inMemoryRepository";
import type { ListingsRepository } from "../src/lib/listings/types";

describe("InMemoryListingsRepository", () => {
  let repo: ListingsRepository;

  beforeEach(() => {
    repo = createInMemoryRepository();
  });

  test("list() with no filters returns all seed listings", async () => {
    const listings = await repo.list();
    expect(listings.length).toBeGreaterThanOrEqual(4);
  });

  test("list() filters by city (case-insensitive, partial match)", async () => {
    const listings = await repo.list({ city: "beograd" });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((l) => l.city.toLowerCase().includes("beograd"))).toBe(true);
  });

  test("list() filters by propertyType", async () => {
    const listings = await repo.list({ propertyType: "studio" });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((l) => l.propertyType === "studio")).toBe(true);
  });

  test("list() filters by listingType", async () => {
    const listings = await repo.list({ listingType: "rent" });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((l) => l.listingType === "rent")).toBe(true);
  });

  test("list() filters by price range", async () => {
    const listings = await repo.list({ minPrice: 200000, maxPrice: 300000 });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((l) => l.price >= 200000 && l.price <= 300000)).toBe(true);
  });

  test("getById() returns the matching listing", async () => {
    const [first] = await repo.list();
    const found = await repo.getById(first.id);
    expect(found?.id).toBe(first.id);
  });

  test("getById() returns null for an unknown id", async () => {
    const found = await repo.getById("does-not-exist");
    expect(found).toBeNull();
  });

  test("create() adds a listing that then appears in list()", async () => {
    const created = await repo.create(
      {
        title: "Test stan",
        listingType: "sale",
        propertyType: "apartment",
        city: "Kragujevac",
        address: "Test ulica 1",
        price: 50000,
        pricePeriod: "total",
        areaSqm: 40,
        rooms: 1,
        bathrooms: 1,
        description: "Test opis.",
      },
      "owner-123",
    );

    expect(created.id).toBeTruthy();
    expect(created.ownerId).toBe("owner-123");

    const found = await repo.getById(created.id);
    expect(found?.title).toBe("Test stan");

    const listed = await repo.list({ city: "Kragujevac" });
    expect(listed.some((l) => l.id === created.id)).toBe(true);
  });
});
