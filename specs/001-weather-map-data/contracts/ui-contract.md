# UI Contract: World Weather Map

## Primary Screen

The first screen is the world weather map. It contains:

- Interactive map canvas
- Search control
- Unit toggle
- Weather layer control
- Legend for the active weather layer
- Marker detail panel when a marker or search result is selected
- Loading, empty, error, success, disabled, and permission-denied states where applicable

`app/page.tsx` is a Server Component shell. Browser-only map state lives in
`components/weather-map/weather-map-shell.tsx`, which owns selected marker state, search
centering, active layer state, unit state, and MapLibre lifecycle events.

## Marker Behavior

- Markers represent cities or points, not continuous weather rasters, for the MVP.
- Markers remain aligned with geographic coordinates during pan and zoom.
- Marker styling changes with the active weather layer.
- Marker clusters or density rules prevent unreadable overlap at low zoom levels.
- Selecting a marker opens a detail panel without changing the current map position unless
  the selection comes from search.

## Search Behavior

- Search accepts city, country, region, or place names.
- Multiple matching results display country/region context.
- Selecting a result centers the map on that location and opens its weather detail panel.
- Empty results preserve the current map state and present a revise-search path.

## Detail Panel Behavior

- Shows location name, country/region when available, temperature, condition, humidity,
  wind speed, last updated time, freshness, and forecast when available.
- Distinguishes `current`, `cached`, `stale`, and `unavailable` data.
- Keeps the map usable when forecast or optional layer data is unavailable.

## Accessibility

- Primary controls are reachable by keyboard.
- Focus is visible for map controls, search, layer controls, unit toggle, markers, and the
  detail panel close action.
- Controls and weather values have semantic labels.
- Color-coded layer states include text, icons, or legend labels that do not rely on color
  alone.

## Responsive Behavior

- Desktop layout keeps controls and detail panel visible without covering essential map
  controls.
- Mobile layout allows the detail panel to collapse or slide while preserving map
  interaction.
- Text inside controls and panels must not overlap or truncate critical weather values.