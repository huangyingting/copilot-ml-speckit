import { describe, expect, it } from "vitest";
import {
  MapViewSchema,
  ProviderConfigSchema,
  WeatherObservationSchema,
  WeatherLayerSchema,
} from "@/lib/weather/schemas";

describe("weather schemas", () => {
  it("accepts a map view with permission-denied state", () => {
    const parsed = MapViewSchema.parse({
      bounds: { west: -123, south: 37, east: -121, north: 38 },
      center: { latitude: 37.5, longitude: -122.2 },
      zoom: 6,
      activeLayer: "temperature",
      units: "metric",
      selectedLocationId: undefined,
      loadingState: "permission-denied",
    });

    expect(parsed.loadingState).toBe("permission-denied");
  });

  it("rejects invalid weather percentages", () => {
    expect(() =>
      WeatherObservationSchema.parse({
        locationId: "x",
        temperature: 20,
        condition: "Clear",
        humidityPercent: 101,
        observedAt: "2026-07-07T12:00:00Z",
        receivedAt: "2026-07-07T12:01:00Z",
        freshness: "current",
      }),
    ).toThrow();
  });

  it("requires non-color legend cues for weather layers", () => {
    const layer = WeatherLayerSchema.parse({
      id: "wind",
      label: "Wind",
      legendStops: [
        { label: "Calm", cue: "dot", min: 0 },
        { label: "Breezy", cue: "arrow", min: 20 },
      ],
      fallbackLabel: "Wind unavailable",
    });

    expect(layer.legendStops[1]?.cue).toBe("arrow");
  });

  it("rejects public map style URLs with secret-looking query params", () => {
    expect(() =>
      ProviderConfigSchema.parse({
        weatherProvider: "open-meteo",
        geocodingProvider: "open-meteo",
        mapStyleUrl: "https://tiles.example/style.json?api_key=secret",
        markerTtlSeconds: 300,
        searchTtlSeconds: 86400,
        forecastTtlSeconds: 600,
      }),
    ).toThrow(/secret/i);
  });
});