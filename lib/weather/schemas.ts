import { z } from "zod";

export const UnitsSchema = z.enum(["metric", "imperial"]);
export const WeatherLayerIdSchema = z.enum(["temperature", "precipitation", "wind", "cloud"]);
export const LoadingStateSchema = z.enum(["idle", "loading", "success", "empty", "error", "disabled", "permission-denied"]);
export const FreshnessSchema = z.enum(["current", "cached", "stale", "unavailable"]);

export const CoordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const BoundsSchema = z
  .object({
    west: z.number().min(-180).max(180),
    south: z.number().min(-90).max(90),
    east: z.number().min(-180).max(180),
    north: z.number().min(-90).max(90),
  })
  .refine((bounds) => bounds.south <= bounds.north, "south must be <= north");

export const MapViewSchema = z.object({
  bounds: BoundsSchema,
  center: CoordinateSchema,
  zoom: z.number().min(0).max(22),
  activeLayer: WeatherLayerIdSchema,
  units: UnitsSchema,
  selectedLocationId: z.string().min(1).optional(),
  loadingState: LoadingStateSchema,
});

export const LocationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1).optional(),
  rank: z.number().optional(),
});

const PercentSchema = z.number().min(0).max(100);
const IsoTimestampSchema = z.string().datetime({ offset: true });

export const WeatherObservationSchema = z.object({
  locationId: z.string().min(1),
  temperature: z.number(),
  condition: z.string().min(1),
  humidityPercent: PercentSchema.optional(),
  windSpeed: z.number().min(0).optional(),
  windDirectionDegrees: z.number().min(0).max(359).optional(),
  precipitationProbabilityPercent: PercentSchema.optional(),
  cloudCoveragePercent: PercentSchema.optional(),
  observedAt: IsoTimestampSchema,
  receivedAt: IsoTimestampSchema,
  freshness: FreshnessSchema,
});

export const ForecastPeriodSchema = z.object({
  startsAt: IsoTimestampSchema,
  temperature: z.number().optional(),
  condition: z.string().min(1).optional(),
  precipitationProbabilityPercent: PercentSchema.optional(),
  windSpeed: z.number().min(0).optional(),
  cloudCoveragePercent: PercentSchema.optional(),
});

export const WeatherForecastSchema = z.object({
  locationId: z.string().min(1),
  periods: z.array(ForecastPeriodSchema),
  availability: z.enum(["available", "partial", "unavailable"]),
  updatedAt: IsoTimestampSchema,
});

export const WeatherLayerSchema = z.object({
  id: WeatherLayerIdSchema,
  label: z.string().min(1),
  legendStops: z.array(
    z.object({
      label: z.string().min(1),
      cue: z.string().min(1),
      min: z.number(),
      max: z.number().optional(),
    }),
  ).min(1),
  fallbackLabel: z.string().min(1),
});

export const ProviderConfigSchema = z
  .object({
    weatherProvider: z.literal("open-meteo"),
    geocodingProvider: z.literal("open-meteo"),
    mapStyleUrl: z.string().url(),
    markerTtlSeconds: z.literal(300),
    searchTtlSeconds: z.literal(86400),
    forecastTtlSeconds: z.literal(600),
  })
  .superRefine((config, context) => {
    const url = new URL(config.mapStyleUrl);
    for (const key of url.searchParams.keys()) {
      if (/^(api_?key|key|token|access_token|client_secret)$/i.test(key)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Public map style URL must not contain secret-looking query parameters",
          path: ["mapStyleUrl"],
        });
      }
    }
  });

export const WeatherMarkerSchema = z.object({
  location: LocationSchema,
  observation: WeatherObservationSchema,
});

export type Units = z.infer<typeof UnitsSchema>;
export type WeatherLayerId = z.infer<typeof WeatherLayerIdSchema>;
export type LoadingState = z.infer<typeof LoadingStateSchema>;
export type Bounds = z.infer<typeof BoundsSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type WeatherObservation = z.infer<typeof WeatherObservationSchema>;
export type ForecastPeriod = z.infer<typeof ForecastPeriodSchema>;
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;
export type WeatherLayer = z.infer<typeof WeatherLayerSchema>;
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
export type WeatherMarker = z.infer<typeof WeatherMarkerSchema>;