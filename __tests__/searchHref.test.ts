import { expect, test } from "vitest";
import { buildSearchHref } from "../src/lib/searchHref";

test("buildSearchHref returns root path when there are no params", () => {
  expect(buildSearchHref({}, {})).toBe("/");
});

test("buildSearchHref merges current params with overrides", () => {
  const href = buildSearchHref({ city: "Beograd" }, { propertyType: "apartment" });
  expect(href).toContain("city=Beograd");
  expect(href).toContain("propertyType=apartment");
});

test("buildSearchHref lets an override clear a param", () => {
  const href = buildSearchHref({ city: "Beograd", propertyType: "apartment" }, { propertyType: undefined });
  expect(href).toContain("city=Beograd");
  expect(href).not.toContain("propertyType");
});
