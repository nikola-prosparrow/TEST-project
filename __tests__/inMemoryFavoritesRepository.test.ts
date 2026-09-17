import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryFavoritesRepository } from "../src/lib/favorites/inMemoryRepository";
import type { FavoritesRepository } from "../src/lib/favorites/types";

describe("InMemoryFavoritesRepository", () => {
  let repo: FavoritesRepository;

  beforeEach(() => {
    repo = createInMemoryFavoritesRepository();
  });

  test("listIdsByUser() is empty for a user with no favorites", async () => {
    expect(await repo.listIdsByUser("user-1")).toEqual([]);
  });

  test("add() then listIdsByUser() returns the added listing id", async () => {
    await repo.add("user-1", "listing-a");
    expect(await repo.listIdsByUser("user-1")).toEqual(["listing-a"]);
  });

  test("add() is idempotent for the same user/listing pair", async () => {
    await repo.add("user-1", "listing-a");
    await repo.add("user-1", "listing-a");
    expect(await repo.listIdsByUser("user-1")).toEqual(["listing-a"]);
  });

  test("remove() deletes the favorite", async () => {
    await repo.add("user-1", "listing-a");
    await repo.remove("user-1", "listing-a");
    expect(await repo.listIdsByUser("user-1")).toEqual([]);
  });

  test("favorites are isolated per user", async () => {
    await repo.add("user-1", "listing-a");
    await repo.add("user-2", "listing-b");
    expect(await repo.listIdsByUser("user-1")).toEqual(["listing-a"]);
    expect(await repo.listIdsByUser("user-2")).toEqual(["listing-b"]);
  });
});
