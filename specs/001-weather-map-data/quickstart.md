# Quickstart: World Weather Map Validation

## Prerequisites

- Node.js LTS compatible with the selected Next.js version
- Package manager selected during implementation
- Weather, geocoding, and map tile provider configuration documented in environment setup
- Test runner, Playwright browsers, and accessibility tooling installed

## Setup

```bash
npm install
cp .env.example .env.local
```

Populate `.env.local` with provider configuration:

```bash
WEATHER_PROVIDER=open-meteo
GEOCODING_PROVIDER=open-meteo
NEXT_PUBLIC_MAP_STYLE_URL=https://example.com/path/to/maplibre-style.json
```

Provider secrets, if a non-default provider is selected later, must remain server-side and
must not be exposed to client components. `NEXT_PUBLIC_MAP_STYLE_URL` must not contain
secret credentials.

## Validation Commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Manual Validation Scenarios

### Scenario 1: Explore Current Weather Globally

1. Start the app with `npm run dev`.
2. Open the home page.
3. Confirm the world map appears as the first screen.
4. Pan and zoom to at least three regions.
5. Confirm representative city/point weather markers appear and remain aligned to the map.
6. Select a marker and verify temperature, condition, humidity, wind speed, and last
   updated time are shown.

Expected outcome: P1 works independently with current weather markers and detail panels.

### Scenario 2: Search and Inspect a Location

1. Search for three globally distributed locations.
2. Select one result from each search.
3. Confirm the map centers on the selected location and opens its detail panel.
4. Search for a no-match query.

Expected outcome: P2 works independently with distinguishable results and an empty state.

### Scenario 3: Compare Layers and Forecasts

1. Toggle temperature, precipitation, wind, and cloud coverage layers.
2. Confirm marker styling and legend text update without changing map position.
3. Select two markers and inspect forecast details.
4. Simulate unavailable forecast data.

Expected outcome: P3 works independently and degrades gracefully when optional data is
unavailable.

## Performance and Accessibility Checks

- Measure Core Web Vitals in a production build and verify LCP <= 2.5s, INP <= 200ms, and
  CLS <= 0.1 for the primary map view.
- Verify first-load JavaScript is <= 180 KB gzip excluding the async map chunk, the async
  map chunk is <= 750 KB gzip, and the default visible map starts with <= 16 tile requests.
- Verify no third-party scripts are loaded beyond the configured map style/tile requests.
- Verify selected-location weather responses return a current result, cached result, or
  clear error within 2 seconds for 95% of normal-network requests.
- Run automated accessibility checks and manually verify keyboard access, visible focus,
  semantic labels, and non-color layer cues for primary controls.