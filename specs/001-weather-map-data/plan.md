# Implementation Plan: World Weather Map

**Branch**: `001-weather-map-data` | **Date**: 2026-07-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-weather-map-data/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a Next.js web application whose first screen is an interactive world map with
representative city/point weather markers. The MVP uses option B from clarification:
current conditions appear as selectable markers and selected locations open a detail panel;
search, unit preference, weather-layer metric views, and short-term forecast details build
on the same point-based weather model. Server-side route handlers proxy external weather
and geocoding providers, normalize data, and provide short-lived caching so client map
interactions remain responsive.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.x App Router

**Primary Dependencies**: Next.js, React, MapLibre GL JS, Vitest, React Testing Library,
Playwright, axe-core accessibility tooling, Open-Meteo forecast/geocoding APIs, and a
configurable MapLibre style URL for map tiles

**Storage**: No persistent application database for v1; visit-scoped unit/layer preference
in browser state, with server-side fetch cache for external weather/geocoding responses

**Testing**: Vitest for pure data normalization and API contract tests, React Testing
Library for component states, Playwright for map/search/layer journeys, axe checks for
primary controls and detail panels

**Target Platform**: Responsive web application for current evergreen desktop and mobile
browsers

**Project Type**: Next.js web app

**Performance Goals**: Initial usable map LCP <= 2.5s, INP <= 200ms, CLS <= 0.1;
first-load JavaScript <= 180 KB gzip excluding the async map chunk; async map chunk <= 750
KB gzip; no third-party scripts beyond the configured map style/tile requests; selected-location
weather response within 2 seconds for 95% of normal-network requests; smooth pan/zoom
feedback while marker data refreshes

**Constraints**: Option B point markers for MVP; avoid continuous global weather rasters in
P1/P2; `app/page.tsx` remains a Server Component; all interactive map state lives in a
focused `WeatherMapShell` Client Component; server-only provider configuration; no
persistent accounts or saved favorites; weather refresh requests deduplicated by
viewport/zoom and cached for short freshness windows

**Scale/Scope**: Single public web app with three independently deliverable stories: global
current-weather map, search and inspect, metric layer/forecast comparison

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: PASS. Plan uses strict TypeScript, explicit `app/`, `components/`,
  `lib/`, and server-only provider modules. Commands to define during setup: `npm run
  lint`, `npm run typecheck`, `npm test`, and `npm run test:e2e`.
- **Testing**: PASS. Unit, component, contract, integration, accessibility, and end-to-end
  validation are mapped in quickstart and contracts. No automation gap is planned.
- **UX Consistency**: PASS. Plan requires map controls, search, unit selection, layer
  controls, loading/error/empty/success/permission-denied states, keyboard access,
  semantic labels, and legends for color-coded weather values.
- **Performance**: PASS. Core Web Vitals, selected-weather latency, marker request
  deduplication, client bundle budgets, provider-cache TTLs, and third-party resource
  limits are explicit.
- **Next.js Architecture**: PASS. App Router is the app shell; map widget is a focused
  Client Component; provider access, normalization, route handlers, cache policy, and
  runtime selection remain server-side.

## Rendering, Runtime, and Cache Policy

- **`app/page.tsx`**: Server Component route shell. It exports `revalidate = 3600` for the
  static application frame and imports the interactive map through
  `components/weather-map/weather-map-shell.tsx`. No `use client` directive is allowed in
  `app/page.tsx`.
- **`components/weather-map/weather-map-shell.tsx`**: Client Component boundary for
  MapLibre lifecycle, selected marker state, search centering, layer state, unit state,
  and browser-only event handling.
- **`/api/weather/markers`**: Route handler exports `runtime = 'nodejs'` and
  `dynamic = 'force-dynamic'`. Cache key uses rounded bbox, zoom bucket, layer, and units;
  successful provider responses use a 5-minute server TTL and deduplicate in-flight
  viewport requests.
- **`/api/weather/search`**: Route handler exports `runtime = 'nodejs'` and
  `dynamic = 'force-dynamic'`. Cache key uses normalized query and limit; successful
  geocoding responses use a 24-hour server TTL.
- **`/api/weather/forecast`**: Route handler exports `runtime = 'nodejs'` and
  `dynamic = 'force-dynamic'`. Cache key uses location id, rounded coordinates, and units;
  successful forecast responses use a 10-minute server TTL.
- **Provider failures**: Route handlers return normalized `400`, `404`, `429`, or `502`
  responses per [api-contract.md](contracts/api-contract.md) and never leak provider
  credentials, provider-specific raw payloads, or unchecked environment variables.

## Project Structure

### Documentation (this feature)

```text
specs/001-weather-map-data/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-contract.md
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── api/
│   └── weather/
│       ├── markers/route.ts
│       ├── search/route.ts
│       └── forecast/route.ts
├── error.tsx
├── globals.css
├── layout.tsx
├── loading.tsx
└── page.tsx

components/
├── weather-map/
│   ├── weather-map-shell.tsx
│   ├── map-canvas.tsx
│   ├── marker-detail-panel.tsx
│   ├── search-control.tsx
│   ├── layer-control.tsx
│   ├── unit-toggle.tsx
│   └── weather-legend.tsx
└── ui/

lib/
├── server/
│   ├── geocoding-provider.ts
│   ├── weather-provider.ts
│   └── cache-policy.ts
├── weather/
│   ├── normalize.ts
│   ├── schemas.ts
│   └── units.ts
└── map/
    ├── viewport.ts
    └── marker-density.ts

styles/
public/

tests/
├── contract/
├── integration/
├── unit/
└── e2e/
```

**Structure Decision**: Use a single Next.js App Router application at repository root.
All provider configuration and external API calls stay under `lib/server/` and route
handlers. `app/page.tsx` remains a Server Component that renders static shell content and
hands browser-only interaction to `components/weather-map/weather-map-shell.tsx`. The map
canvas and controls are isolated behind that Client Component boundary; normalization,
cache policy, unit conversion, and schema validation remain in shared or server-only
modules.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
