import { NextResponse } from "next/server";
import { selectMarkersForDensity } from "@/lib/map/marker-density";
import { createViewportCacheKey, normalizeBbox } from "@/lib/map/viewport";
import { CACHE_TTLS, createTtlCache, dedupeInFlight } from "@/lib/server/cache-policy";
import { getServerEnv } from "@/lib/server/env";
import { fetchOpenMeteoCurrent } from "@/lib/server/weather-provider";
import {
  BoundsSchema,
  UnitsSchema,
  WeatherLayerIdSchema,
  type Location,
  type Units,
  type WeatherMarker,
} from "@/lib/weather/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MarkerResponse = {
  bbox: [number, number, number, number];
  zoom: number;
  layer: string;
  units: Units;
  freshness: "current" | "cached";
  generatedAt: string;
  markers: WeatherMarker[];
};

const markerCache = createTtlCache<MarkerResponse>();

const representativeLocations: Location[] = [
  { id: "san-francisco-us", name: "San Francisco", country: "United States", region: "California", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", rank: 1 },
  { id: "new-york-us", name: "New York", country: "United States", region: "New York", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York", rank: 2 },
  { id: "london-gb", name: "London", country: "United Kingdom", region: "England", latitude: 51.5072, longitude: -0.1276, timezone: "Europe/London", rank: 3 },
  { id: "paris-fr", name: "Paris", country: "France", region: "Ile-de-France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", rank: 4 },
  { id: "nairobi-ke", name: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219, timezone: "Africa/Nairobi", rank: 5 },
  { id: "tokyo-jp", name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", rank: 6 },
  { id: "sydney-au", name: "Sydney", country: "Australia", region: "New South Wales", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", rank: 7 },
  { id: "sao-paulo-br", name: "Sao Paulo", country: "Brazil", latitude: -23.5558, longitude: -46.6396, timezone: "America/Sao_Paulo", rank: 8 },
];

function locationWithinBounds(location: Location, bounds: { west: number; south: number; east: number; north: number }): boolean {
  const longitudeMatch = bounds.west <= bounds.east
    ? location.longitude >= bounds.west && location.longitude <= bounds.east
    : location.longitude >= bounds.west || location.longitude <= bounds.east;

  return longitudeMatch && location.latitude >= bounds.south && location.latitude <= bounds.north;
}

function fallbackObservation(location: Location, units: Units, generatedAt: string, index: number): WeatherMarker {
  const baseTemperature = units === "metric" ? 16 + index * 2 : 61 + index * 3;
  return {
    location,
    observation: {
      locationId: location.id,
      temperature: baseTemperature,
      condition: index % 2 === 0 ? "Partly cloudy" : "Clear",
      humidityPercent: 55 + index,
      windSpeed: units === "metric" ? 8 + index : 5 + index,
      windDirectionDegrees: (index * 45) % 360,
      precipitationProbabilityPercent: 10 + index,
      cloudCoveragePercent: 30 + index,
      observedAt: generatedAt,
      receivedAt: generatedAt,
      freshness: "cached",
    },
  };
}

async function markerForLocation(location: Location, units: Units, generatedAt: string, index: number): Promise<WeatherMarker> {
  try {
    const observation = await fetchOpenMeteoCurrent(location, units, generatedAt);
    return { location, observation };
  } catch {
    return fallbackObservation(location, units, generatedAt, index);
  }
}

export async function GET(request: Request) {
  getServerEnv();
  const url = new URL(request.url);
  const bboxParam = url.searchParams.get("bbox");
  const zoom = Number(url.searchParams.get("zoom"));
  const layer = WeatherLayerIdSchema.safeParse(url.searchParams.get("layer"));
  const units = UnitsSchema.safeParse(url.searchParams.get("units"));

  if (!bboxParam || Number.isNaN(zoom) || !layer.success || !units.success) {
    return NextResponse.json({ error: "invalid markers query" }, { status: 400 });
  }

  let bounds;
  try {
    bounds = BoundsSchema.parse(normalizeBbox(bboxParam));
  } catch {
    return NextResponse.json({ error: "invalid bounds" }, { status: 400 });
  }

  const cacheKey = createViewportCacheKey({ bbox: bounds, zoom, layer: layer.data, units: units.data });
  const cached = markerCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, freshness: "cached" }, { headers: { "cache-control": "public, max-age=300" } });
  }

  const responseBody = await dedupeInFlight(cacheKey, async () => {
    const generatedAt = new Date().toISOString();
    const visibleLocations = representativeLocations.filter((location) => locationWithinBounds(location, bounds));
    const locations = visibleLocations.length > 0 ? visibleLocations : representativeLocations.slice(0, 4);
    const selected = selectMarkersForDensity(
      await Promise.all(locations.map((location, index) => markerForLocation(location, units.data, generatedAt, index))),
      zoom,
    );
    const body: MarkerResponse = {
      bbox: [bounds.west, bounds.south, bounds.east, bounds.north],
      zoom,
      layer: layer.data,
      units: units.data,
      freshness: "current",
      generatedAt,
      markers: selected,
    };
    markerCache.set(cacheKey, body, CACHE_TTLS.markers);
    return body;
  });

  return NextResponse.json(responseBody, { headers: { "cache-control": "public, max-age=300" } });
}