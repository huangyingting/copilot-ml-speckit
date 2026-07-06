import type { Location, WeatherObservation } from "@/lib/weather/schemas";

export const sanFrancisco: Location = {
  id: "san-francisco-us",
  name: "San Francisco",
  country: "United States",
  region: "California",
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: "America/Los_Angeles",
  rank: 1,
};

export const paris: Location = {
  id: "paris-fr",
  name: "Paris",
  country: "France",
  region: "Ile-de-France",
  latitude: 48.8566,
  longitude: 2.3522,
  timezone: "Europe/Paris",
  rank: 1,
};

export const currentObservation: WeatherObservation = {
  locationId: sanFrancisco.id,
  temperature: 18.2,
  condition: "Partly cloudy",
  humidityPercent: 76,
  windSpeed: 12.4,
  windDirectionDegrees: 270,
  precipitationProbabilityPercent: 10,
  cloudCoveragePercent: 45,
  observedAt: "2026-07-07T11:45:00Z",
  receivedAt: "2026-07-07T12:00:00Z",
  freshness: "current",
};

export const openMeteoCurrentPayload = {
  current: {
    time: "2026-07-07T11:45",
    temperature_2m: 18.2,
    relative_humidity_2m: 76,
    weather_code: 2,
    wind_speed_10m: 12.4,
    wind_direction_10m: 270,
    precipitation_probability: 10,
    cloud_cover: 45,
  },
};

export const openMeteoForecastPayload = {
  hourly: {
    time: Array.from({ length: 24 }, (_, index) => `2026-07-07T${String(index).padStart(2, "0")}:00`),
    temperature_2m: Array.from({ length: 24 }, (_, index) => 18 + index / 10),
    weather_code: Array.from({ length: 24 }, () => 1),
    precipitation_probability: Array.from({ length: 24 }, () => 15),
    wind_speed_10m: Array.from({ length: 24 }, () => 8.5),
    cloud_cover: Array.from({ length: 24 }, () => 32),
  },
};