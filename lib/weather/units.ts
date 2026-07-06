import type { Units } from "./schemas";

export function convertTemperature(value: number, from: Units, to: Units): number {
  if (from === to) return value;
  return to === "imperial" ? (value * 9) / 5 + 32 : ((value - 32) * 5) / 9;
}

export function convertWindSpeed(value: number, from: Units, to: Units): number {
  if (from === to) return value;
  return to === "imperial" ? value * 0.621371 : value / 0.621371;
}

export function formatTemperature(value: number, units: Units): string {
  return `${Math.round(value)}${units === "metric" ? "°C" : "°F"}`;
}

export function formatWindSpeed(value: number, units: Units): string {
  return `${Math.round(value)} ${units === "metric" ? "km/h" : "mph"}`;
}