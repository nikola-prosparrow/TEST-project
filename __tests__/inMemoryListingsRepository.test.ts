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

  test("listByOwner() returns only listings created by that owner", async () => {
    const created = await repo.create(
      {
        title: "Vlasnikov stan",
        listingType: "sale",
        propertyType: "apartment",
        city: "Niš",
        address: "Test ulica 2",
        price: 80000,
        pricePeriod: "total",
        areaSqm: 45,
        rooms: 2,
        bathrooms: 1,
        description: "Test opis broj dva.",
      },
      "owner-456",
    );

    const owned = await repo.listByOwner("owner-456");
    expect(owned.map((l) => l.id)).toEqual([created.id]);

    const ownedByOther = await repo.listByOwner("owner-does-not-exist");
    expect(ownedByOther).toEqual([]);
  });

  test("countRecentByOwner() counts only listings created after the given time", async () => {
    const ownerId = "owner-rate-limit";
    await repo.create(
      {
        title: "Prvi test oglas",
        listingType: "sale",
        propertyType: "apartment",
        city: "Niš",
        address: "Test ulica 3",
        price: 80000,
        pricePeriod: "total",
        areaSqm: 45,
        rooms: 2,
        bathrooms: 1,
        description: "Test opis broj tri.",
      },
      ownerId,
    );

    const future = new Date(Date.now() + 60_000);
    const past = new Date(Date.now() - 60_000);

    expect(await repo.countRecentByOwner(ownerId, future)).toBe(0);
    expect(await repo.countRecentByOwner(ownerId, past)).toBe(1);
  });

  test("updatePhotos() sets photoPaths on the listing", async () => {
    const created = await repo.create(
      {
        title: "Stan sa fotografijama",
        listingType: "sale",
        propertyType: "apartment",
        city: "Kragujevac",
        address: "Test ulica 4",
        price: 60000,
        pricePeriod: "total",
        areaSqm: 40,
        rooms: 1,
        bathrooms: 1,
        description: "Test opis broj četiri.",
      },
      "owner-123",
    );

    await repo.updatePhotos(created.id, ["owner-123/a.jpg", "owner-123/b.jpg"]);

    const found = await repo.getById(created.id);
    expect(found?.photoPaths).toEqual(["owner-123/a.jpg", "owner-123/b.jpg"]);
  });

  test("setBestFinalDeadline() sets and clears the deadline", async () => {
    const created = await repo.create(
      {
        title: "Stan sa rokom",
        listingType: "sale",
        propertyType: "apartment",
        city: "Kragujevac",
        address: "Test ulica 5",
        price: 60000,
        pricePeriod: "total",
        areaSqm: 40,
        rooms: 1,
        bathrooms: 1,
        description: "Test opis broj pet.",
      },
      "owner-123",
    );

    expect((await repo.getById(created.id))?.bestFinalDeadline).toBeNull();

    await repo.setBestFinalDeadline(created.id, "2026-12-01T00:00:00.000Z");
    expect((await repo.getById(created.id))?.bestFinalDeadline).toBe("2026-12-01T00:00:00.000Z");

    await repo.setBestFinalDeadline(created.id, null);
    expect((await repo.getById(created.id))?.bestFinalDeadline).toBeNull();
  });
});
