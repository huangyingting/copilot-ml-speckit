import { expect, test } from "@playwright/test";

test("visitor explores current weather markers globally", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /world weather map/i })).toBeVisible();
  await expect(page.getByTestId("weather-map")).toBeVisible();
  const marker = page.locator(".weather-marker").first();
  await expect(marker).toBeVisible({ timeout: 15_000 });

  await marker.click();

  const detailPanel = page.locator(".detail-panel");
  await expect(detailPanel.locator("h2")).toBeVisible();
  await expect(detailPanel.getByText(/humidity/i)).toBeVisible();
  await expect(detailPanel.getByText(/wind/i)).toBeVisible();
  await expect(detailPanel.getByText(/updated/i)).toBeVisible();
});