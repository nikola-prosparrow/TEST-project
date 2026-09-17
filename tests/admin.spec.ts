import { test, expect } from "@playwright/test";

test("admin dashboard is not publicly visible — redirects unauthenticated visitors to sign in", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/prijava\?next=%2Fadmin/);
  await expect(page.getByRole("heading", { level: 1, name: "Prijavi se" })).toBeVisible();
});
