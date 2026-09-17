import { expect, test } from "vitest";
import { formatPrice, formatPricePerArea } from "../src/lib/format";

test("formatPrice formats a sale price without a period suffix", () => {
  expect(formatPrice({ price: 189000, currency: "EUR", pricePeriod: "total" })).toBe("€189.000");
});

test("formatPrice appends a monthly suffix for rentals", () => {
  expect(formatPrice({ price: 520, currency: "EUR", pricePeriod: "monthly" })).toBe("€520 / mesečno");
});

test("formatPricePerArea computes price per square meter for sales", () => {
  expect(
    formatPricePerArea({ price: 189000, currency: "EUR", pricePeriod: "total", areaSqm: 64 }),
  ).toBe("≈ €2.953 / m²");
});

test("formatPricePerArea shows a deposit label for rentals instead of price/m²", () => {
  expect(
    formatPricePerArea({ price: 520, currency: "EUR", pricePeriod: "monthly", areaSqm: 32 }),
  ).toBe("Depozit: €520 / mesečno");
});
