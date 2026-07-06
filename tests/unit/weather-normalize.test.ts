import { describe, expect, it } from "vitest";
import { normalizeOpenMeteoForecast, normalizeOpenMeteoObservation, weatherCodeToCondition } from "@/lib/weather/normalize";
import { openMeteoCurrentPayload, openMeteoForecastPayload, sanFrancisco } from "../fixtures/weather";

describe("Open-Meteo normalization", () => {
  it("maps known weather codes to readable conditions", () => {
    expect(weatherCodeToCondition(0)).toBe("Clear");
    expect(weatherCodeToCondition(99)).toBe("Thunderstorm with hail");
  });

  it("normalizes current weather into app observation shape", () => {
    const observation = normalizeOpenMeteoObservation(sanFrancisco, openMeteoCurrentPayload, "2026-07-07T12:00:00Z");

    expect(observation).toMatchObject({
      locationId: "san-francisco-us",
      condition: "Partly cloudy",
      freshness: "current",
      humidityPercent: 76,
    });
  });

  it("normalizes at least 24 forecast periods when available", () => {
    const forecast = normalizeOpenMeteoForecast(sanFrancisco.id, openMeteoForecastPayload, "2026-07-07T12:00:00Z");

    expect(forecast.availability).toBe("available");
    expect(forecast.periods).toHaveLength(24);
  });
});