# Phase 0 Research: World Weather Map

## Decision: Use Option B Point Markers for MVP Weather Visualization

**Rationale**: The user selected option B. Representative city/point markers support the
core global weather task, keep provider requirements moderate, simplify caching and tests,
and avoid making the first release dependent on heavy continuous weather raster tiles.

**Alternatives considered**:

- Continuous overlays from the first release: richer visual density, but heavier provider,
  rendering, and performance risk for the MVP.
- Hybrid point markers plus raster layers: useful later, but unnecessary for P1/P2 and
  better treated as a P3 enhancement if provider support is available.
- Region summaries: simpler visually, but less useful for city search and selected-location
  details.

## Decision: Next.js App Router with Server-Side Provider Proxies

**Rationale**: The constitution requires server-first Next.js architecture. Route handlers
will proxy weather, geocoding, and forecast data; this keeps provider credentials and cache
policy server-side while presenting stable app contracts to the Client Component map.

**Alternatives considered**:

- Direct browser calls to providers: simpler, but exposes provider details and makes cache,
  rate limiting, and schema normalization harder to control.
- Separate backend service: unnecessary for v1 because the scope is a single app with a few
  read-oriented endpoints.

## Decision: MapLibre GL JS for the Interactive Map Surface

**Rationale**: MapLibre GL JS is open source, supports vector tiles, markers, layers,
controls, and custom sources, and can be isolated in a client-only map component. It avoids
locking the app to a single proprietary map SDK at the component API boundary.

**Alternatives considered**:

- Leaflet: lighter and mature, but less capable for vector-tile styling and future layer
  visualization.
- Proprietary hosted map SDKs: polished, but add account, licensing, and token constraints
  that should be deferred to implementation/provider selection.

## Decision: Open-Meteo APIs and Configurable MapLibre Style URL

**Rationale**: Use Open-Meteo forecast and geocoding APIs as the default weather/geocoding
provider boundary for v1, with normalized internal route contracts shielding UI components
from provider response shapes. Use `NEXT_PUBLIC_MAP_STYLE_URL` for the MapLibre style so
tile hosting can be configured without changing map components. Weather/geocoding provider
configuration remains server-side through `WEATHER_PROVIDER` and `GEOCODING_PROVIDER`.

**Alternatives considered**:

- Provider selection deferred to implementation: flexible, but left environment templates,
  adapter work, and setup docs underspecified.
- Proprietary weather and geocoding SDKs: can be richer, but add credential and licensing
  decisions that are unnecessary for the option B MVP.

## Decision: Server Page Shell with Focused Client Map Shell

**Rationale**: The constitution requires server-first architecture. `app/page.tsx` remains a
Server Component with `revalidate = 3600`; browser-only map lifecycle, selected marker,
search centering, layer, and unit state live in `WeatherMapShell`. This keeps provider and
route decisions server-side while allowing MapLibre interaction in the browser.

**Alternatives considered**:

- Marking `app/page.tsx` as a Client Component: simpler state wiring, but violates the
  server-first boundary and risks importing server-only modules into client paths.

## Decision: Explicit Route Runtime and Cache TTLs

**Rationale**: All weather route handlers use `runtime = 'nodejs'` and
`dynamic = 'force-dynamic'` so provider access and normalized errors stay server-side while
query-specific responses are not statically cached. Marker responses cache for 5 minutes by
rounded viewport/layer/units, search responses cache for 24 hours by normalized query, and
forecast responses cache for 10 minutes by location/coordinates/units.

**Alternatives considered**:

- Static route caching: incompatible with query-dependent provider data.
- No server TTLs: simpler, but likely to hit provider limits and degrade pan/zoom
  responsiveness.

## Decision: Numeric Performance Budgets for Map MVP

**Rationale**: The MVP must keep the primary map usable while loading a heavy browser map
library. The first-load JavaScript budget is <= 180 KB gzip excluding the async map chunk;
the async map chunk budget is <= 750 KB gzip; no third-party scripts are allowed beyond the
configured map style/tile requests; initial visible map requests should stay to <= 16 tile
requests at the default zoom; weather marker/detail API responses must meet the spec's
2-second p95 target under normal network conditions.

**Alternatives considered**:

- Deferring budgets to implementation: easier, but not testable against the constitution's
  performance-budget rule.

## Decision: Stable Internal API Contracts for Markers, Search, and Forecasts

**Rationale**: The app should not couple UI components to external provider response shapes.
Internal route contracts normalize location, current observation, forecast, and availability
states so tests and UI behavior remain stable if providers change.

**Alternatives considered**:

- Provider-native response pass-through: faster initially, but pushes provider-specific
  fields into UI tests and makes provider replacement expensive.

## Decision: Short-Lived Cache and Request Deduplication by Viewport

**Rationale**: Map pan/zoom events can produce bursts of requests. A cache key based on
rounded viewport bounds, zoom bucket, active layer, and units reduces duplicate provider
calls while preserving visible data freshness. Selected-location detail responses should
return a current result, cached result, or clear error within the spec's 2-second target.

**Alternatives considered**:

- No caching: simple but risks rate limits and poor responsiveness.
- Persistent database cache: useful at larger scale but outside v1 because the spec excludes
  persistent application storage.

## Decision: Required Validation Stack

**Rationale**: The constitution requires tests as evidence. Use unit tests for schemas,
normalization, units, and marker density; contract tests for route response shapes;
component tests for loading/error/empty/success states; Playwright for map/search/layer
journeys; accessibility checks for primary controls and detail panels.

**Alternatives considered**:

- Manual browser-only validation: insufficient for the constitution and fragile for map
  regression behavior.

## Documentation Lookup Note

Context7 documentation lookup was attempted during planning, but the local Context7 API key
is invalid. Implementation should re-check current Next.js, MapLibre GL JS, and selected
provider documentation once the documentation service or direct provider docs are available.