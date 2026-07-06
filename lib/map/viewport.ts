import type { Bounds, Units, WeatherLayerId } from "@/lib/weather/schemas";

const PRECISION = 3;

function roundCoordinate(value: number): number {
  return Number(value.toFixed(PRECISION));
}

export function normalizeBbox(bbox: string): Bounds {
  const parts = bbox.split(",").map((part) => Number(part.trim()));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    throw new Error("bbox must contain west,south,east,north numeric values");
  }

  const [west, south, east, north] = parts;
  return {
    west: roundCoordinate(west),
    south: roundCoordinate(south),
    east: roundCoordinate(east),
    north: roundCoordinate(north),
  };
}

export function normalizeBounds(bounds: Bounds): Bounds {
  return {
    west: roundCoordinate(bounds.west),
    south: roundCoordinate(bounds.south),
    east: roundCoordinate(bounds.east),
    north: roundCoordinate(bounds.north),
  };
}

export function zoomBucket(zoom: number): number {
  return Math.max(0, Math.min(22, Math.floor(zoom)));
}

export function createViewportCacheKey(input: {
  bbox: Bounds;
  zoom: number;
  layer: WeatherLayerId;
  units: Units;
}): string {
  const bounds = normalizeBounds(input.bbox);
  return `markers:${bounds.west}:${bounds.south}:${bounds.east}:${bounds.north}:z${zoomBucket(input.zoom)}:${input.layer}:${input.units}`;
}

export function createSearchCacheKey(query: string, limit: number): string {
  return `search:${query.trim().toLowerCase().replace(/\s+/g, " ")}:${limit}`;
}

export function createForecastCacheKey(locationId: string, latitude: number, longitude: number, units: Units): string {
  return `forecast:${locationId}:${roundCoordinate(latitude)}:${roundCoordinate(longitude)}:${units}`;
}