import type { Units, WeatherLayerId } from "./schemas";

export type UserPreference = {
  activeLayer: WeatherLayerId;
  units: Units;
};

export function getDefaultPreference(): UserPreference {
  return { activeLayer: "temperature", units: "metric" };
}

export function setActiveLayer(preference: UserPreference, activeLayer: WeatherLayerId): UserPreference {
  return { ...preference, activeLayer };
}

export function setUnits(preference: UserPreference, units: Units): UserPreference {
  return { ...preference, units };
}