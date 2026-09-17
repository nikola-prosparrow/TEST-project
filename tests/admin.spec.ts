import { test, expect } from "@playwright/test";

test("admin page renders roadmap, CI status, tech debt, and architecture sections", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { level: 1, name: "ProSparrow — Admin" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI status", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Roadmap" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tech debt" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Arhitektonske odluke" })).toBeVisible();

  await expect(page.getByText("Baza podataka za oglase")).toBeVisible();
  await expect(page.getByText("Nema autentikacije ni autorizacije")).toBeVisible();
});
