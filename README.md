# World Weather Map

Interactive Next.js weather map that uses representative city/point markers for the MVP,
with Open-Meteo as the default weather and geocoding provider.

## Setup

```bash
npm install
cp .env.example .env.local
```

Default provider configuration:

```bash
WEATHER_PROVIDER=open-meteo
GEOCODING_PROVIDER=open-meteo
NEXT_PUBLIC_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json
```

`WEATHER_PROVIDER` and `GEOCODING_PROVIDER` are server-side provider selectors.
`NEXT_PUBLIC_MAP_STYLE_URL` is public by design and must not contain secret credentials.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Validation Scenarios

- Explore current weather globally: load the home page, pan/zoom, select a marker, and
  verify current conditions.
- Search and inspect: search for a location, select a distinguishable result, and verify
  the detail panel updates.
- Compare layers and forecasts: toggle weather layers, switch units, and inspect forecast
  details.

## Architecture Notes

- `app/page.tsx` remains a Server Component and exports `revalidate = 3600`.
- `components/weather-map/weather-map-shell.tsx` owns browser-only map, search, layer,
  unit, selected marker, and forecast state.
- Weather API route handlers use `runtime = "nodejs"` and `dynamic = "force-dynamic"`.
- Provider responses are normalized before they reach UI components.