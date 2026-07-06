import { expect, test } from "@playwright/test";

test("primary map shell respects performance budget signals", async ({ page }) => {
  const scriptRequests: string[] = [];
  const tileRequests: string[] = [];

  page.on("request", (request) => {
    const url = request.url();
    if (request.resourceType() === "script") scriptRequests.push(url);
    if (/tile|demotiles|maplibre/i.test(url)) tileRequests.push(url);
  });

  await page.goto("/");
  await expect(page.getByTestId("weather-map")).toBeVisible();

  expect(scriptRequests.filter((url) => !url.includes("/_next/")).length).toBeLessThanOrEqual(0);
  expect(tileRequests.length).toBeLessThanOrEqual(16);
});