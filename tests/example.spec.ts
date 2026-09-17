import { test, expect } from "@playwright/test";

test("home page loads with expected title and heading", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ProSparrow/);
  await expect(
    page.getByRole("heading", { level: 1, name: /pronađi dom koji ti sedne/i }),
  ).toBeVisible();
});

test("listing detail page renders with title and price", async ({ page }) => {
  await page.goto("/listing/l1");

  await expect(page).toHaveTitle(/Svetao dvosoban stan/);
  await expect(
    page.getByRole("heading", { level: 1, name: /svetao dvosoban stan/i }),
  ).toBeVisible();
  await expect(page.getByText("€189.000").first()).toBeVisible();
});

test("clicking a listing card on the home page navigates to its detail page", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Moderna garsonjera").click();

  await expect(page).toHaveURL(/\/listing\/l3$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /moderna garsonjera/i }),
  ).toBeVisible();
});

test("unknown listing id renders a 404", async ({ page }) => {
  const response = await page.goto("/listing/does-not-exist");
  expect(response?.status()).toBe(404);
});
