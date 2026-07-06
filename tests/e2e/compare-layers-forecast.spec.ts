import { expect, test } from "@playwright/test";

test("visitor compares layers and forecast", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /wind/i }).click();
  await expect(page.getByText(/active layer: wind/i)).toBeVisible();
  await page.getByRole("button", { name: /imperial/i }).click();
  await page.getByRole("button", { name: /san francisco/i }).click();

  await expect(page.getByText(/24-hour forecast/i)).toBeVisible();
});