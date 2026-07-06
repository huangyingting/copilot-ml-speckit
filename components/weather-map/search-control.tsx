"use client";

import { useState } from "react";
import { StateMessage } from "@/components/ui/state-message";
import type { LoadingState, Location } from "@/lib/weather/schemas";

type SearchControlProps = {
  loadingState: LoadingState;
  results: Location[];
  onSearch: (query: string) => Promise<void> | void;
  onSelectLocation: (location: Location) => void;
};

function locationLabel(location: Location): string {
  return [location.name, location.region, location.country].filter(Boolean).join(", ");
}

function locationAriaLabel(location: Location): string {
  return [location.name, location.country].filter(Boolean).join(", ");
}

export function SearchControl({ loadingState, results, onSearch, onSelectLocation }: SearchControlProps) {
  const [query, setQuery] = useState("");
  const disabled = loadingState === "disabled" || loadingState === "loading";

  return (
    <section className="search-control" aria-label="Location search">
      <form
        className="search-control__form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          void onSearch(query);
        }}
      >
        <label htmlFor="location-search">Search location</label>
        <div className="search-control__row">
          <input
            id="location-search"
            type="search"
            value={query}
            disabled={disabled}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="City, country, or region"
          />
          <button type="submit" disabled={disabled || query.trim().length === 0}>
            Search
          </button>
        </div>
      </form>
      {loadingState === "empty" ? <StateMessage state="empty" title="No matching locations" message="Revise the search and try again." /> : null}
      {loadingState === "error" ? <StateMessage state="error" title="Search unavailable" message="Location results could not be loaded." /> : null}
      {results.length > 0 ? (
        <div className="search-control__results" aria-live="polite">
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              aria-label={locationAriaLabel(location)}
              onClick={() => {
                onSelectLocation(location);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSelectLocation(location);
              }}
            >
              {locationLabel(location)}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}