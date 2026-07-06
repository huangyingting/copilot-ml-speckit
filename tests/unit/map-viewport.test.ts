import { describe, expect, it } from "vitest";
import { createForecastCacheKey, createSearchCacheKey, createViewportCacheKey, normalizeBbox } from "@/lib/map/viewport";

describe("viewport cache keys", () => {
  it("normalizes bbox strings to rounded numeric bounds", () => {
    expect(normalizeBbox("-122.41949,37.77494,-121.90001,38.10009")).toEqual({
      west: -122.419,
      south: 37.775,
      east: -121.9,
      north: 38.1,
    });
  });

  it("creates stable marker keys from viewport, zoom bucket, layer, and units", () => {
    expect(
      createViewportCacheKey({
        bbox: { west: -122.4194, south: 37.7749, east: -121.9, north: 38.1 },
        zoom: 6.4,
        layer: "temperature",
        units: "metric",
      }),
    ).toBe("markers:-122.419:37.775:-121.9:38.1:z6:temperature:metric");
  });

  it("normalizes search and forecast keys", () => {
    expect(createSearchCacheKey("  San Francisco  ", 8)).toBe("search:san francisco:8");
    expect(createForecastCacheKey("paris-fr", 48.85661, 2.35222, "imperial")).toBe("forecast:paris-fr:48.857:2.352:imperial");
  });
});