# API Contract: World Weather Map

All endpoints return JSON and are served by Next.js route handlers under `/api/weather`.
Provider credentials, provider response shapes, and cache policy remain server-side.

## Route Runtime and Cache Policy

- `GET /api/weather/markers`: `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, 5-minute
  server TTL keyed by rounded bbox, zoom bucket, layer, and units.
- `GET /api/weather/search`: `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, 24-hour
  server TTL keyed by normalized query and limit.
- `GET /api/weather/forecast`: `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, 10-minute
  server TTL keyed by location id, rounded coordinates, and units.
- Error responses MUST be normalized and MUST NOT expose raw provider payloads or secrets.

## GET /api/weather/markers

Returns weather markers for the visible map area.

### Query Parameters

- `bbox` (required): comma-separated `west,south,east,north` coordinates
- `zoom` (required): current map zoom level
- `layer` (required): `temperature`, `precipitation`, `wind`, or `cloud`
- `units` (required): `metric` or `imperial`

### Success Response: 200

```json
{
  "bbox": [-122.6, 37.6, -121.8, 38.1],
  "zoom": 6,
  "layer": "temperature",
  "units": "metric",
  "freshness": "current",
  "generatedAt": "2026-07-07T12:00:00Z",
  "markers": [
    {
      "location": {
        "id": "san-francisco-us",
        "name": "San Francisco",
        "country": "United States",
        "region": "California",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "timezone": "America/Los_Angeles"
      },
      "observation": {
        "temperature": 18.2,
        "condition": "Partly cloudy",
        "humidityPercent": 76,
        "windSpeed": 12.4,
        "windDirectionDegrees": 270,
        "precipitationProbabilityPercent": 10,
        "cloudCoveragePercent": 45,
        "observedAt": "2026-07-07T11:45:00Z",
        "receivedAt": "2026-07-07T12:00:00Z",
        "freshness": "current"
      }
    }
  ]
}
```

### Error Responses

- `400`: invalid bounds, zoom, layer, or units
- `429`: provider or application rate limit reached
- `502`: weather provider unavailable or returned unusable data

## GET /api/weather/search

Searches for locations and returns distinguishable results.

### Query Parameters

- `q` (required): user-entered city, country, region, or place name
- `limit` (optional): maximum result count, default 8

### Success Response: 200

```json
{
  "query": "Paris",
  "results": [
    {
      "id": "paris-fr",
      "name": "Paris",
      "country": "France",
      "region": "Ile-de-France",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "timezone": "Europe/Paris",
      "rank": 1
    }
  ]
}
```

### Error Responses

- `400`: empty or invalid query
- `502`: geocoding provider unavailable or returned unusable data

## GET /api/weather/forecast

Returns current details and at least 24 hours of forecast data for one location when
available.

### Query Parameters

- `locationId` (required): stable internal location identifier
- `lat` (required): location latitude
- `lon` (required): location longitude
- `units` (required): `metric` or `imperial`

### Success Response: 200

```json
{
  "location": {
    "id": "paris-fr",
    "name": "Paris",
    "country": "France",
    "region": "Ile-de-France",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "timezone": "Europe/Paris"
  },
  "observation": {
    "temperature": 24.1,
    "condition": "Clear",
    "humidityPercent": 52,
    "windSpeed": 8.2,
    "windDirectionDegrees": 180,
    "precipitationProbabilityPercent": 5,
    "cloudCoveragePercent": 12,
    "observedAt": "2026-07-07T12:00:00Z",
    "receivedAt": "2026-07-07T12:03:00Z",
    "freshness": "current"
  },
  "forecast": {
    "availability": "available",
    "updatedAt": "2026-07-07T12:03:00Z",
    "periods": [
      {
        "startsAt": "2026-07-07T13:00:00Z",
        "temperature": 25.0,
        "condition": "Clear",
        "precipitationProbabilityPercent": 5,
        "windSpeed": 7.9,
        "cloudCoveragePercent": 10
      }
    ]
  }
}
```

### Error Responses

- `400`: invalid location or coordinates
- `404`: location cannot be resolved
- `502`: forecast provider unavailable or returned unusable data