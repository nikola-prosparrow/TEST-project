import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryOffersRepository } from "../src/lib/offers/inMemoryRepository";
import type { OffersRepository } from "../src/lib/offers/types";

describe("InMemoryOffersRepository", () => {
  let repo: OffersRepository;

  beforeEach(() => {
    repo = createInMemoryOffersRepository();
  });

  test("create() returns an offer with pending status and a generated id", async () => {
    const offer = await repo.create(
      {
        listingId: "listing-a",
        ownerId: "owner-1",
        bidderName: "Marko",
        bidderEmail: "marko@example.com",
        amount: 200000,
      },
      "bidder-1",
    );

    expect(offer.id).toBeTruthy();
    expect(offer.status).toBe("pending");
    expect(offer.bidderId).toBe("bidder-1");
  });

  test("listByOwner() returns only offers on that owner's listings", async () => {
    await repo.create(
      { listingId: "listing-a", ownerId: "owner-1", bidderName: "Marko", bidderEmail: "m@x.com", amount: 200000 },
      "bidder-1",
    );
    await repo.create(
      { listingId: "listing-b", ownerId: "owner-2", bidderName: "Ana", bidderEmail: "a@x.com", amount: 150000 },
      "bidder-2",
    );

    const ownerOneOffers = await repo.listByOwner("owner-1");
    expect(ownerOneOffers).toHaveLength(1);
    expect(ownerOneOffers[0].bidderName).toBe("Marko");
  });

  test("listByBidder() returns only offers submitted by that bidder", async () => {
    await repo.create(
      { listingId: "listing-a", ownerId: "owner-1", bidderName: "Marko", bidderEmail: "m@x.com", amount: 200000 },
      "bidder-1",
    );
    await repo.create(
      { listingId: "listing-b", ownerId: "owner-2", bidderName: "Marko", bidderEmail: "m@x.com", amount: 150000 },
      "bidder-1",
    );
    await repo.create(
      { listingId: "listing-c", ownerId: "owner-3", bidderName: "Ana", bidderEmail: "a@x.com", amount: 90000 },
      "bidder-2",
    );

    const bidderOneOffers = await repo.listByBidder("bidder-1");
    expect(bidderOneOffers).toHaveLength(2);
  });

  test("getById() returns the matching offer", async () => {
    const created = await repo.create(
      { listingId: "listing-a", ownerId: "owner-1", bidderName: "Marko", bidderEmail: "m@x.com", amount: 200000 },
      "bidder-1",
    );
    const found = await repo.getById(created.id);
    expect(found?.id).toBe(created.id);
  });

  test("getById() returns null for an unknown id", async () => {
    expect(await repo.getById("does-not-exist")).toBeNull();
  });

  test("updateStatus() changes the offer's status", async () => {
    const offer = await repo.create(
      { listingId: "listing-a", ownerId: "owner-1", bidderName: "Marko", bidderEmail: "m@x.com", amount: 200000 },
      "bidder-1",
    );

    await repo.updateStatus(offer.id, "accepted");

    const [updated] = await repo.listByOwner("owner-1");
    expect(updated.status).toBe("accepted");
  });
});
