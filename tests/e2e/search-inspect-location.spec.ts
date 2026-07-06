import { expect, test } from "@playwright/test";

test("visitor searches and inspects a location", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("searchbox", { name: /search location/i }).fill("Paris");
  await page.getByRole("button", { name: /^search$/i }).click();
  await page.getByRole("button", { name: /paris, france/i }).click();

  await expect(page.getByRole("heading", { name: /paris/i })).toBeVisible();
  await expect(page.getByText(/humidity/i)).toBeVisible();

  await page.getByRole("searchbox", { name: /search location/i }).fill("zzzz-no-match");
  await page.getByRole("button", { name: /^search$/i }).click();

  await expect(page.getByText(/no matching locations/i)).toBeVisible();
});