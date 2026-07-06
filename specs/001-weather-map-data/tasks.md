# Tasks: World Weather Map

**Input**: Design documents from `/specs/001-weather-map-data/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: REQUIRED by the constitution for every behavior change. Test tasks appear before
the implementation tasks they validate. No test omissions are planned.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks
- **[Story]**: User story label for story-specific work only, e.g. [US1], [US2], [US3]
- Every task includes at least one exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js application, toolchain, provider environment, and shared app shell.

- [ ] T001 Create package manifest, dependency list, and scripts in package.json
- [ ] T002 Configure strict TypeScript settings in tsconfig.json
- [ ] T003 [P] Configure Next.js application settings in next.config.ts
- [ ] T004 [P] Configure linting rules in eslint.config.mjs
- [ ] T005 [P] Configure Vitest test runner in vitest.config.ts
- [ ] T006 [P] Create shared test setup in tests/setup.ts
- [ ] T007 [P] Configure Playwright browser tests in playwright.config.ts
- [ ] T008 [P] Create provider environment template with WEATHER_PROVIDER, GEOCODING_PROVIDER, and NEXT_PUBLIC_MAP_STYLE_URL in .env.example
- [ ] T009 Create root App Router layout in app/layout.tsx
- [ ] T010 Create global styles and design tokens in app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, validation, provider boundaries, cache policy, and utilities required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

### Foundational Tests

- [ ] T011 [P] Create reusable weather/map test fixtures in tests/fixtures/weather.ts
- [ ] T012 [P] Add schema validation unit tests for map, weather, provider config, and permission-denied states in tests/unit/weather-schemas.test.ts
- [ ] T013 [P] Add unit conversion tests in tests/unit/weather-units.test.ts
- [ ] T014 [P] Add viewport normalization and cache-key tests for bbox, zoom, layer, units, and location keys in tests/unit/map-viewport.test.ts
- [ ] T015 [P] Add marker density tests in tests/unit/marker-density.test.ts
- [ ] T016 [P] Add Open-Meteo weather normalization tests in tests/unit/weather-normalize.test.ts
- [ ] T017 [P] Add cache policy tests for 5-minute marker, 24-hour search, and 10-minute forecast TTLs in tests/unit/cache-policy.test.ts
- [ ] T018 [P] Add server environment validation tests for provider defaults and public map style safety in tests/unit/server-env.test.ts
- [ ] T019 [P] Add server/client boundary tests preventing server-only imports in client components in tests/unit/server-client-boundary.test.ts

### Foundational Implementation

- [ ] T020 Implement domain schemas for locations, observations, forecasts, layers, preferences, and provider config in lib/weather/schemas.ts
- [ ] T021 Implement metric/imperial conversion helpers in lib/weather/units.ts
- [ ] T022 Implement viewport bounds normalization and request cache-key helpers in lib/map/viewport.ts
- [ ] T023 Implement marker density and clustering rules in lib/map/marker-density.ts
- [ ] T024 Implement Open-Meteo provider-to-domain weather normalization in lib/weather/normalize.ts
- [ ] T025 Implement cache policy constants and in-flight deduplication helpers in lib/server/cache-policy.ts
- [ ] T026 [P] Implement Open-Meteo weather provider adapter boundary in lib/server/weather-provider.ts
- [ ] T027 [P] Implement Open-Meteo geocoding provider adapter boundary in lib/server/geocoding-provider.ts
- [ ] T028 Implement server-only environment validation for WEATHER_PROVIDER, GEOCODING_PROVIDER, and NEXT_PUBLIC_MAP_STYLE_URL in lib/server/env.ts
- [ ] T029 [P] Create reusable loading, empty, error, success, disabled, and permission-denied state component in components/ui/state-message.tsx

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Explore Current Weather Globally (Priority: P1) MVP

**Goal**: A visitor opens an interactive world map, pans/zooms globally, sees representative city/point current-weather markers, and selects a marker for current details.

**Independent Test**: Open the app, confirm the world map loads, pan/zoom to at least three regions, verify current-weather markers remain aligned, and select a marker to view temperature, condition, humidity, wind speed, and last updated time.

### Tests for User Story 1 (REQUIRED)

- [ ] T030 [P] [US1] Add contract tests for GET /api/weather/markers runtime, dynamic mode, 5-minute cache behavior, and normalized errors in tests/contract/weather-markers.contract.test.ts
- [ ] T031 [P] [US1] Add map canvas component tests for loading, empty, error, success, pan, zoom, and marker states in tests/integration/map-canvas-current.test.tsx
- [ ] T032 [P] [US1] Add marker detail panel component tests for current observation fields and freshness labels in tests/integration/marker-detail-panel.test.tsx
- [ ] T033 [P] [US1] Add weather map shell tests for selected marker state and Client Component boundary in tests/integration/weather-map-shell-current.test.tsx
- [ ] T034 [P] [US1] Add server page shell tests for app/page.tsx revalidate policy and no client directive in tests/integration/page-shell.test.tsx
- [ ] T035 [P] [US1] Add end-to-end global map exploration test in tests/e2e/explore-current-weather.spec.ts

### Implementation for User Story 1

- [ ] T036 [US1] Implement GET /api/weather/markers route handler with runtime nodejs, force-dynamic mode, 5-minute TTL, and deduplication in app/api/weather/markers/route.ts
- [ ] T037 [US1] Implement MapLibre map canvas with option B point-marker rendering in components/weather-map/map-canvas.tsx
- [ ] T038 [US1] Implement selected marker detail panel for current conditions in components/weather-map/marker-detail-panel.tsx
- [ ] T039 [US1] Implement WeatherMapShell Client Component for MapLibre lifecycle and selected marker state in components/weather-map/weather-map-shell.tsx
- [ ] T040 [US1] Compose Server Component page shell with revalidate 3600 and WeatherMapShell import in app/page.tsx
- [ ] T041 [US1] Add App Router loading fallback for the map screen in app/loading.tsx
- [ ] T042 [US1] Add App Router error fallback for map/weather failures in app/error.tsx

**Checkpoint**: User Story 1 is functional and testable independently as the MVP.

---

## Phase 4: User Story 2 - Search and Inspect a Location (Priority: P2)

**Goal**: A visitor searches for a city, country, or region, chooses a distinguishable result, and the map centers on that location with its weather details open.

**Independent Test**: Search for at least three globally distributed locations, choose results, verify the map centers on each location and opens local weather details, then verify a no-match query shows a clear empty state.

### Tests for User Story 2 (REQUIRED)

- [ ] T043 [P] [US2] Add contract tests for GET /api/weather/search runtime, dynamic mode, 24-hour cache behavior, distinguishable results, and normalized errors in tests/contract/weather-search.contract.test.ts
- [ ] T044 [P] [US2] Add search control component tests for results, ambiguous matches, empty state, error state, and keyboard behavior in tests/integration/search-control.test.tsx
- [ ] T045 [P] [US2] Add weather map shell tests for search centering and marker detail state in tests/integration/weather-map-shell-search.test.tsx
- [ ] T046 [P] [US2] Add end-to-end search and inspect flow test in tests/e2e/search-inspect-location.spec.ts

### Implementation for User Story 2

- [ ] T047 [US2] Implement GET /api/weather/search route handler with runtime nodejs, force-dynamic mode, and 24-hour TTL in app/api/weather/search/route.ts
- [ ] T048 [US2] Implement searchable location control with distinguishable results in components/weather-map/search-control.tsx
- [ ] T049 [US2] Connect search selection to map centering and marker detail state in components/weather-map/weather-map-shell.tsx
- [ ] T050 [US2] Add search empty, error, disabled, and keyboard focus states in components/weather-map/search-control.tsx
- [ ] T051 [US2] Add accessible search labels and result announcements in components/weather-map/search-control.tsx

**Checkpoint**: User Story 2 works independently after foundation and preserves User Story 1 behavior.

---

## Phase 5: User Story 3 - Compare Weather Layers and Forecasts (Priority: P3)

**Goal**: A visitor switches between weather metric views over the point markers and inspects at least 24 hours of forecast details for selected locations when available.

**Independent Test**: Toggle temperature, precipitation, wind, and cloud layers without losing map position, inspect forecast details for two locations, and verify unavailable forecast/layer data degrades gracefully.

### Tests for User Story 3 (REQUIRED)

- [ ] T052 [P] [US3] Add contract tests for GET /api/weather/forecast runtime, dynamic mode, 10-minute cache behavior, 24-hour forecast shape, and normalized errors in tests/contract/weather-forecast.contract.test.ts
- [ ] T053 [P] [US3] Add unit tests for layer and unit preference state in tests/unit/weather-layer-preferences.test.ts
- [ ] T054 [P] [US3] Add layer control and legend component tests in tests/integration/layer-control.test.tsx
- [ ] T055 [P] [US3] Add forecast detail panel component tests for available, partial, and unavailable forecasts in tests/integration/forecast-detail-panel.test.tsx
- [ ] T056 [P] [US3] Add weather map shell tests for layer, unit, legend, and forecast state in tests/integration/weather-map-shell-layers.test.tsx
- [ ] T057 [P] [US3] Add end-to-end layer and forecast comparison test in tests/e2e/compare-layers-forecast.spec.ts

### Implementation for User Story 3

- [ ] T058 [US3] Implement GET /api/weather/forecast route handler with runtime nodejs, force-dynamic mode, and 10-minute TTL in app/api/weather/forecast/route.ts
- [ ] T059 [US3] Implement weather layer control for temperature, precipitation, wind, and cloud in components/weather-map/layer-control.tsx
- [ ] T060 [US3] Implement non-color weather legend cues for active layer values in components/weather-map/weather-legend.tsx
- [ ] T061 [US3] Implement metric/imperial unit toggle with visit-scoped state in components/weather-map/unit-toggle.tsx
- [ ] T062 [US3] Add forecast rendering and unavailable-data states to detail panel in components/weather-map/marker-detail-panel.tsx
- [ ] T063 [US3] Connect layer, unit, legend, and forecast state in components/weather-map/weather-map-shell.tsx

**Checkpoint**: All user stories are independently functional and can be validated through quickstart scenarios.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation, accessibility, performance, security, and release validation across all stories.

- [ ] T064 [P] Add cross-story accessibility regression checks in tests/integration/accessibility.test.tsx
- [ ] T065 [P] Add production-build performance budget checks for LCP, INP, CLS, 180 KB first-load JS, 750 KB async map chunk, 16 initial tile requests, and third-party script limits in tests/e2e/performance-budget.spec.ts
- [ ] T066 [P] Document setup, Open-Meteo defaults, map style configuration, provider environment variables, and validation commands in README.md
- [ ] T067 [P] Harden provider secret handling and server-only import boundaries in lib/server/env.ts
- [ ] T068 Run full quickstart validation commands and scenarios documented in specs/001-weather-map-data/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundation; delivers MVP.
- **User Story 2 (Phase 4)**: Depends on Foundation and can be built after or alongside US1, but WeatherMapShell integration must preserve US1 behavior.
- **User Story 3 (Phase 5)**: Depends on Foundation and can be built after or alongside US1/US2, but WeatherMapShell and detail panel integrations must preserve prior stories.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No story dependency; required MVP.
- **US2 (P2)**: Uses the WeatherMapShell and detail panel patterns from US1, but its search API/control can be developed independently after Foundation.
- **US3 (P3)**: Uses the shared marker/detail patterns from US1 and optional selection flows from US2, but its forecast API, layer controls, and legend can be developed independently after Foundation.

### Within Each User Story

- Write and run story tests first; confirm they fail before implementing story behavior.
- Implement server route contracts before wiring UI fetch flows.
- Implement components before integrating them into components/weather-map/weather-map-shell.tsx or app/page.tsx.
- Validate each story independently at its checkpoint before continuing.

## Parallel Opportunities

- Setup tasks T003-T008 can run in parallel after T001 and T002 are underway.
- Foundational tests T011-T019 can run in parallel because each uses separate files.
- Foundational implementations T021-T029 can run in parallel after their corresponding tests exist, except T024 depends on T020 and provider fixture shapes.
- US1 tests T030-T035 can run in parallel; T037 and T038 can run in parallel after T036 contract shape is known.
- US2 tests T043-T046 can run in parallel; T047 and T048 can run in parallel before T049 shell integration.
- US3 tests T052-T057 can run in parallel; T058-T061 can run in parallel before T062 and T063 integration.
- Polish tasks T064-T067 can run in parallel after the targeted story files exist.

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add contract tests for GET /api/weather/markers runtime, dynamic mode, 5-minute cache behavior, and normalized errors in tests/contract/weather-markers.contract.test.ts"
Task: "Add map canvas component tests for loading, empty, error, success, pan, zoom, and marker states in tests/integration/map-canvas-current.test.tsx"
Task: "Add marker detail panel component tests for current observation fields and freshness labels in tests/integration/marker-detail-panel.test.tsx"
Task: "Add weather map shell tests for selected marker state and Client Component boundary in tests/integration/weather-map-shell-current.test.tsx"
Task: "Add end-to-end global map exploration test in tests/e2e/explore-current-weather.spec.ts"

# Then implement independent files before screen integration:
Task: "Implement GET /api/weather/markers route handler with runtime nodejs, force-dynamic mode, 5-minute TTL, and deduplication in app/api/weather/markers/route.ts"
Task: "Implement MapLibre map canvas with option B point-marker rendering in components/weather-map/map-canvas.tsx"
Task: "Implement selected marker detail panel for current conditions in components/weather-map/marker-detail-panel.tsx"
Task: "Implement WeatherMapShell Client Component for MapLibre lifecycle and selected marker state in components/weather-map/weather-map-shell.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add contract tests for GET /api/weather/search runtime, dynamic mode, 24-hour cache behavior, distinguishable results, and normalized errors in tests/contract/weather-search.contract.test.ts"
Task: "Add search control component tests for results, ambiguous matches, empty state, error state, and keyboard behavior in tests/integration/search-control.test.tsx"
Task: "Add weather map shell tests for search centering and marker detail state in tests/integration/weather-map-shell-search.test.tsx"
Task: "Add end-to-end search and inspect flow test in tests/e2e/search-inspect-location.spec.ts"
Task: "Implement GET /api/weather/search route handler with runtime nodejs, force-dynamic mode, and 24-hour TTL in app/api/weather/search/route.ts"
Task: "Implement searchable location control with distinguishable results in components/weather-map/search-control.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "Add contract tests for GET /api/weather/forecast runtime, dynamic mode, 10-minute cache behavior, 24-hour forecast shape, and normalized errors in tests/contract/weather-forecast.contract.test.ts"
Task: "Add unit tests for layer and unit preference state in tests/unit/weather-layer-preferences.test.ts"
Task: "Add layer control and legend component tests in tests/integration/layer-control.test.tsx"
Task: "Add weather map shell tests for layer, unit, legend, and forecast state in tests/integration/weather-map-shell-layers.test.tsx"
Task: "Add end-to-end layer and forecast comparison test in tests/e2e/compare-layers-forecast.spec.ts"
Task: "Implement GET /api/weather/forecast route handler with runtime nodejs, force-dynamic mode, and 10-minute TTL in app/api/weather/forecast/route.ts"
Task: "Implement weather layer control for temperature, precipitation, wind, and cloud in components/weather-map/layer-control.tsx"
Task: "Implement weather legend in components/weather-map/weather-legend.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate US1 independently with `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e -- explore-current-weather`, and the quickstart Scenario 1.
5. Demo or deploy the MVP if validation passes.

### Incremental Delivery

1. Add US1 for global current-weather point markers and details.
2. Add US2 for location search and inspection.
3. Add US3 for layer comparison, unit preference, and forecast details.
4. Run Phase 6 validation before release.

### Parallel Team Strategy

1. One developer owns setup and foundational server/data utilities.
2. One developer owns map canvas and detail panel behavior.
3. One developer owns search, layer, forecast, and E2E coverage once foundation contracts are stable.

## Notes

- [P] tasks use separate files and can proceed in parallel once dependencies are satisfied.
- [US1], [US2], and [US3] labels map directly to prioritized user stories in spec.md.
- Tests are intentionally before implementation tasks to satisfy the constitution.
- Keep option B as the MVP boundary: representative city/point markers, not continuous global weather raster overlays.
- Keep app/page.tsx server-rendered; place browser interaction state in components/weather-map/weather-map-shell.tsx.