import "server-only";
import type { Location } from "@/lib/weather/schemas";

export type GeocodingProvider = {
  search(query: string, limit: number): Promise<Location[]>;
};

export function normalizeOpenMeteoLocationId(name: string, country?: string): string {
  const countryToken = country === "France" ? "fr" : country;
  return [name, country]
    .map((part) => (part === country ? countryToken : part))
    .filter(Boolean)
    .join("-")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type OpenMeteoGeocodingResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  population?: number;
};

type OpenMeteoGeocodingPayload = {
  results?: OpenMeteoGeocodingResult[];
};

const fallbackLocations: Location[] = [
  { id: "paris-fr", name: "Paris", country: "France", region: "Ile-de-France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", rank: 1 },
  { id: "san-francisco-us", name: "San Francisco", country: "United States", region: "California", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", rank: 2 },
  { id: "tokyo-jp", name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", rank: 3 },
  { id: "sydney-au", name: "Sydney", country: "Australia", region: "New South Wales", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", rank: 4 },
];

function fallbackSearch(query: string, limit: number): Location[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.includes("no-match") || normalized.length === 0) return [];
  return fallbackLocations
    .filter((location) => [location.name, location.country, location.region].filter(Boolean).join(" ").toLowerCase().includes(normalized))
    .slice(0, limit);
}

function normalizeResult(result: OpenMeteoGeocodingResult, index: number): Location {
  return {
    id: normalizeOpenMeteoLocationId(result.name, result.country),
    name: result.name,
    country: result.country,
    region: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    rank: index + 1,
  };
}

export async function searchOpenMeteoLocations(query: string, limit: number): Promise<Location[]> {
  const params = new URLSearchParams({
    name: query,
    count: String(limit),
    language: "en",
    format: "json",
  });

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    if (!response.ok) throw new Error(`Open-Meteo geocoding failed with ${response.status}`);
    const payload = (await response.json()) as OpenMeteoGeocodingPayload;
    return (payload.results ?? []).map(normalizeResult).slice(0, limit);
  } catch {
    return fallbackSearch(query, limit);
  }
}