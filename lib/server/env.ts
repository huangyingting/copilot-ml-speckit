import "server-only";
import { ProviderConfigSchema, type ProviderConfig } from "@/lib/weather/schemas";
import { CACHE_TTLS } from "./cache-policy";

const DEFAULT_MAP_STYLE_URL = "https://demotiles.maplibre.org/style.json";

export function getServerEnv(env: NodeJS.ProcessEnv = process.env): ProviderConfig {
  const parsed = ProviderConfigSchema.parse({
    weatherProvider: env.WEATHER_PROVIDER ?? "open-meteo",
    geocodingProvider: env.GEOCODING_PROVIDER ?? "open-meteo",
    mapStyleUrl: env.NEXT_PUBLIC_MAP_STYLE_URL ?? DEFAULT_MAP_STYLE_URL,
    markerTtlSeconds: CACHE_TTLS.markers,
    searchTtlSeconds: CACHE_TTLS.search,
    forecastTtlSeconds: CACHE_TTLS.forecast,
  });
  return Object.freeze(parsed);
}

export { DEFAULT_MAP_STYLE_URL };