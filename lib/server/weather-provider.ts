import "server-only";
import type { Location, Units, WeatherForecast, WeatherObservation } from "@/lib/weather/schemas";
import { normalizeOpenMeteoForecast, normalizeOpenMeteoObservation } from "@/lib/weather/normalize";

export type WeatherProvider = {
  getCurrent(location: Location, units: Units): Promise<WeatherObservation>;
  getForecast(location: Location, units: Units): Promise<WeatherForecast>;
};

export function openMeteoUnits(units: Units): URLSearchParams {
  const params = new URLSearchParams({
    temperature_unit: units === "imperial" ? "fahrenheit" : "celsius",
    wind_speed_unit: units === "imperial" ? "mph" : "kmh",
  });
  return params;
}

export async function fetchOpenMeteoCurrent(
  location: Location,
  units: Units,
  receivedAt = new Date().toISOString(),
): Promise<WeatherObservation> {
  const params = openMeteoUnits(units);
  params.set("latitude", String(location.latitude));
  params.set("longitude", String(location.longitude));
  params.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover");
  params.set("timezone", "UTC");

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo current weather failed with ${response.status}`);
  }

  return normalizeOpenMeteoObservation(location, (await response.json()) as Parameters<typeof normalizeOpenMeteoObservation>[1], receivedAt);
}

export async function fetchOpenMeteoForecast(
  location: Location,
  units: Units,
  receivedAt = new Date().toISOString(),
): Promise<{ observation: WeatherObservation; forecast: WeatherForecast }> {
  const params = openMeteoUnits(units);
  params.set("latitude", String(location.latitude));
  params.set("longitude", String(location.longitude));
  params.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover");
  params.set("hourly", "temperature_2m,weather_code,precipitation_probability,wind_speed_10m,cloud_cover");
  params.set("forecast_days", "2");
  params.set("timezone", "UTC");

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo forecast failed with ${response.status}`);
  }
  const payload = (await response.json()) as Parameters<typeof normalizeOpenMeteoObservation>[1] & Parameters<typeof normalizeOpenMeteoForecast>[1];
  return {
    observation: normalizeOpenMeteoObservation(location, payload, receivedAt),
    forecast: normalizeOpenMeteoForecast(location.id, payload, receivedAt),
  };
}