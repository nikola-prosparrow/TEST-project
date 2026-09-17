import { test, expect } from "@playwright/test";

test("home page loads with expected title and heading", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ProSparrow/);
  await expect(
    page.getByRole("heading", { level: 1, name: /pronađi dom koji ti sedne/i }),
  ).toBeVisible();
});

test("listing detail page renders with title and price", async ({ page }) => {
  await page.goto("/listing");

  await expect(page).toHaveTitle(/Svetao dvosoban stan/);
  await expect(
    page.getByRole("heading", { level: 1, name: /svetao dvosoban stan/i }),
  ).toBeVisible();
  await expect(page.getByText("€189.000").first()).toBeVisible();
});
