import type { Location, WeatherForecast, WeatherObservation } from "./schemas";

type OpenMeteoCurrentPayload = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    precipitation_probability?: number;
    cloud_cover?: number;
  };
};

type OpenMeteoForecastPayload = {
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    precipitation_probability?: number[];
    wind_speed_10m?: number[];
    cloud_cover?: number[];
  };
};

const WEATHER_CODES = new Map<number, string>([
  [0, "Clear"],
  [1, "Mainly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing rime fog"],
  [51, "Light drizzle"],
  [53, "Moderate drizzle"],
  [55, "Dense drizzle"],
  [61, "Slight rain"],
  [63, "Moderate rain"],
  [65, "Heavy rain"],
  [71, "Slight snow"],
  [73, "Moderate snow"],
  [75, "Heavy snow"],
  [80, "Slight rain showers"],
  [81, "Moderate rain showers"],
  [82, "Violent rain showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm with hail"],
  [99, "Thunderstorm with hail"],
]);

export function weatherCodeToCondition(code: number | undefined): string {
  if (code === undefined) return "Unknown";
  return WEATHER_CODES.get(code) ?? "Unknown";
}

function openMeteoTimeToIso(time: string): string {
  if (/Z$|[+-]\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(time)) return `${time}:00Z`;
  return new Date(time).toISOString();
}

export function normalizeOpenMeteoObservation(
  location: Pick<Location, "id">,
  payload: OpenMeteoCurrentPayload,
  receivedAt: string,
): WeatherObservation {
  const current = payload.current;
  return {
    locationId: location.id,
    temperature: current.temperature_2m,
    condition: weatherCodeToCondition(current.weather_code),
    humidityPercent: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    windDirectionDegrees: current.wind_direction_10m,
    precipitationProbabilityPercent: current.precipitation_probability,
    cloudCoveragePercent: current.cloud_cover,
    observedAt: openMeteoTimeToIso(current.time),
    receivedAt,
    freshness: "current",
  };
}

export function normalizeOpenMeteoForecast(
  locationId: string,
  payload: OpenMeteoForecastPayload,
  updatedAt: string,
): WeatherForecast {
  const hourly = payload.hourly;
  const times = hourly?.time ?? [];
  const periods = times.map((time, index) => ({
    startsAt: openMeteoTimeToIso(time),
    temperature: hourly?.temperature_2m?.[index],
    condition: weatherCodeToCondition(hourly?.weather_code?.[index]),
    precipitationProbabilityPercent: hourly?.precipitation_probability?.[index],
    windSpeed: hourly?.wind_speed_10m?.[index],
    cloudCoveragePercent: hourly?.cloud_cover?.[index],
  }));

  return {
    locationId,
    periods,
    availability: periods.length >= 24 ? "available" : periods.length > 0 ? "partial" : "unavailable",
    updatedAt,
  };
}