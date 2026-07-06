# Data Model: World Weather Map

## Map View

**Purpose**: Represents the user's current map state and drives marker loading.

**Fields**:

- `bounds`: visible southwest/northeast latitude and longitude bounds
- `center`: latitude and longitude of the current viewport center
- `zoom`: numeric map zoom level
- `activeLayer`: one of `temperature`, `precipitation`, `wind`, `cloud`
- `units`: one of `metric`, `imperial`
- `selectedLocationId`: optional selected marker/location identifier
- `loadingState`: one of `idle`, `loading`, `success`, `empty`, `error`,
  `permission-denied`

**Validation Rules**:

- Latitude MUST be between -90 and 90.
- Longitude MUST be between -180 and 180.
- Zoom MUST stay within the supported map range chosen during implementation.
- Bounds MUST be normalized before building route request cache keys.

**State Transitions**:

- `idle` -> `loading` when viewport, layer, or units change.
- `loading` -> `success` when marker data is returned.
- `loading` -> `empty` when the request succeeds with no visible marker data.
- `loading` -> `error` when map or weather loading fails.
- `idle` -> `permission-denied` when optional approximate location is requested and the
  browser denies permission.

## Provider Configuration

**Purpose**: Captures the provider decisions and environment values needed by the server
route handlers and client map style.

**Fields**:

- `weatherProvider`: default `open-meteo`
- `geocodingProvider`: default `open-meteo`
- `mapStyleUrl`: public MapLibre style URL supplied through `NEXT_PUBLIC_MAP_STYLE_URL`
- `markerTtlSeconds`: 300
- `searchTtlSeconds`: 86400
- `forecastTtlSeconds`: 600

**Validation Rules**:

- Provider names MUST map to implemented server adapter boundaries.
- Server-only provider configuration MUST not be imported by Client Components.
- Public map style URL MUST not contain secret credentials.

## Location

**Purpose**: Searchable or selectable place associated with weather data.

**Fields**:

- `id`: stable internal location identifier
- `name`: display name
- `country`: optional country name or code
- `region`: optional administrative region
- `latitude`: coordinate latitude
- `longitude`: coordinate longitude
- `timezone`: optional IANA timezone
- `rank`: optional relevance or display ordering value

**Relationships**:

- A Location can have one Weather Observation.
- A Location can have one Weather Forecast when forecast data is available.

**Validation Rules**:

- `id`, `name`, `latitude`, and `longitude` are required.
- Search results with duplicate names MUST include distinguishing country or region context.

## Weather Observation

**Purpose**: Current conditions shown in a marker and detail panel.

**Fields**:

- `locationId`: associated Location identifier
- `temperature`: numeric temperature in requested units
- `condition`: short human-readable condition label
- `humidityPercent`: optional percentage from 0 to 100
- `windSpeed`: optional speed in requested units
- `windDirectionDegrees`: optional compass degrees from 0 to 359
- `precipitationProbabilityPercent`: optional percentage from 0 to 100
- `cloudCoveragePercent`: optional percentage from 0 to 100
- `observedAt`: observation timestamp
- `receivedAt`: app timestamp when data was fetched
- `freshness`: one of `current`, `cached`, `stale`, `unavailable`

**Validation Rules**:

- Percent fields MUST be between 0 and 100.
- Timestamps MUST be parseable ISO 8601 strings in API contracts.
- Stale or unavailable data MUST be labeled in the UI and cannot be presented as current.

## Weather Forecast

**Purpose**: Short-term expected conditions for a selected location.

**Fields**:

- `locationId`: associated Location identifier
- `periods`: ordered list of forecast periods covering at least 24 hours when available
- `availability`: one of `available`, `partial`, `unavailable`
- `updatedAt`: forecast update timestamp

**Forecast Period Fields**:

- `startsAt`: period start timestamp
- `temperature`: optional numeric temperature in requested units
- `condition`: optional condition label
- `precipitationProbabilityPercent`: optional percentage from 0 to 100
- `windSpeed`: optional speed in requested units
- `cloudCoveragePercent`: optional percentage from 0 to 100

**Validation Rules**:

- Periods MUST be sorted by `startsAt` ascending.
- If fewer than 24 hours are available, `availability` MUST be `partial` or `unavailable`.

## Weather Layer

**Purpose**: Describes which metric is emphasized on markers and legends.

**Fields**:

- `id`: one of `temperature`, `precipitation`, `wind`, `cloud`
- `label`: display label
- `legendStops`: ordered display thresholds for marker color, icon, or size
- `fallbackLabel`: text shown when the metric is unavailable for a marker

**Validation Rules**:

- Every layer MUST have non-color legend text or icon cues.
- The active layer MUST not change map center, zoom, or selected location.

## User Preference

**Purpose**: Visit-scoped display settings.

**Fields**:

- `units`: one of `metric`, `imperial`
- `activeLayer`: one of `temperature`, `precipitation`, `wind`, `cloud`

**Validation Rules**:

- Preferences persist only during the current browser visit unless implementation adds a
  documented persistent preference mechanism later.