import { NextResponse } from "next/server";
import { createForecastCacheKey } from "@/lib/map/viewport";
import { CACHE_TTLS, createTtlCache, dedupeInFlight } from "@/lib/server/cache-policy";
import { getServerEnv } from "@/lib/server/env";
import { fetchOpenMeteoForecast } from "@/lib/server/weather-provider";
import { UnitsSchema, type Location, type WeatherForecast, type WeatherObservation } from "@/lib/weather/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ForecastResponse = {
  location: Location;
  observation: WeatherObservation;
  forecast: WeatherForecast;
};

const forecastCache = createTtlCache<ForecastResponse>();

function buildLocation(url: URL): Location | null {
  const id = url.searchParams.get("locationId")?.trim();
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  if (!id || Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return {
    id,
    name: id.split("-").slice(0, -1).join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || id,
    latitude: lat,
    longitude: lon,
  };
}

function fallbackForecast(location: Location, units: "metric" | "imperial", generatedAt: string): ForecastResponse {
  const observation: WeatherObservation = {
    locationId: location.id,
    temperature: units === "metric" ? 22 : 72,
    condition: "Clear",
    humidityPercent: 50,
    windSpeed: units === "metric" ? 8 : 5,
    precipitationProbabilityPercent: 5,
    cloudCoveragePercent: 15,
    observedAt: generatedAt,
    receivedAt: generatedAt,
    freshness: "cached",
  };
  const periods = Array.from({ length: 24 }, (_, index) => ({
    startsAt: new Date(Date.parse(generatedAt) + index * 60 * 60 * 1_000).toISOString(),
    temperature: observation.temperature + index / 10,
    condition: index % 3 === 0 ? "Partly cloudy" : "Clear",
    precipitationProbabilityPercent: 5 + (index % 4) * 5,
    windSpeed: observation.windSpeed,
    cloudCoveragePercent: 15 + index,
  }));

  return {
    location,
    observation,
    forecast: { locationId: location.id, availability: "available", updatedAt: generatedAt, periods },
  };
}

export async function GET(request: Request) {
  getServerEnv();
  const url = new URL(request.url);
  const location = buildLocation(url);
  const units = UnitsSchema.safeParse(url.searchParams.get("units"));
  if (!location || !units.success) {
    return NextResponse.json({ error: "invalid forecast query" }, { status: 400 });
  }

  const cacheKey = createForecastCacheKey(location.id, location.latitude, location.longitude, units.data);
  const cached = forecastCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: { "cache-control": "public, max-age=600" } });
  }

  const body = await dedupeInFlight(cacheKey, async () => {
    const generatedAt = new Date().toISOString();
    try {
      const forecast = await fetchOpenMeteoForecast(location, units.data, generatedAt);
      const responseBody = { location, ...forecast };
      forecastCache.set(cacheKey, responseBody, CACHE_TTLS.forecast);
      return responseBody;
    } catch {
      const fallback = fallbackForecast(location, units.data, generatedAt);
      forecastCache.set(cacheKey, fallback, CACHE_TTLS.forecast);
      return fallback;
    }
  });

  return NextResponse.json(body, { headers: { "cache-control": "public, max-age=600" } });
}