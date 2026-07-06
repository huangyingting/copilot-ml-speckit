"use client";

import { useEffect, useState } from "react";
import { StateMessage } from "@/components/ui/state-message";
import { LayerControl } from "./layer-control";
import { MapCanvas } from "./map-canvas";
import { MarkerDetailPanel } from "./marker-detail-panel";
import { SearchControl } from "./search-control";
import { UnitToggle } from "./unit-toggle";
import { WeatherLegend } from "./weather-legend";
import type { LoadingState, Units, WeatherForecast, WeatherLayerId, WeatherMarker } from "@/lib/weather/schemas";
import type { Location } from "@/lib/weather/schemas";

type MarkerResponse = {
  markers: WeatherMarker[];
};

type SearchResponse = {
  results: Location[];
};

type ForecastResponse = {
  forecast: WeatherForecast;
  observation: WeatherMarker["observation"];
};

const DEFAULT_BBOX = "-180,-60,180,80";

export function WeatherMapShell() {
  const [markers, setMarkers] = useState<WeatherMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<WeatherMarker | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [searchState, setSearchState] = useState<LoadingState>("idle");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [units, setUnits] = useState<Units>("metric");
  const [activeLayer, setActiveLayer] = useState<WeatherLayerId>("temperature");

  useEffect(() => {
    const controller = new AbortController();
    setLoadingState("loading");
    void fetch(`/api/weather/markers?bbox=${DEFAULT_BBOX}&zoom=2&layer=${activeLayer}&units=${units}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("marker request failed");
        return (await response.json()) as MarkerResponse;
      })
      .then((body) => {
        setMarkers(body.markers);
        setLoadingState(body.markers.length > 0 ? "success" : "empty");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadingState("error");
      });

    return () => {
      controller.abort();
    };
  }, [activeLayer, units]);

  async function handleSearch(query: string): Promise<void> {
    setSearchState("loading");
    setSearchResults([]);
    try {
      const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}&limit=8`);
      if (!response.ok) throw new Error("search request failed");
      const body = (await response.json()) as SearchResponse;
      setSearchResults(body.results);
      setSearchState(body.results.length > 0 ? "success" : "empty");
    } catch {
      setSearchState("error");
    }
  }

  async function handleSelectLocation(location: Location): Promise<void> {
    const pad = 0.25;
    const bbox = `${location.longitude - pad},${location.latitude - pad},${location.longitude + pad},${location.latitude + pad}`;
    setLoadingState("loading");
    try {
      const response = await fetch(`/api/weather/markers?bbox=${bbox}&zoom=8&layer=${activeLayer}&units=${units}`);
      if (!response.ok) throw new Error("marker request failed");
      const body = (await response.json()) as MarkerResponse;
      setMarkers(body.markers);
      const selected = body.markers.find((marker) => marker.location.id === location.id) ?? body.markers[0];
      setSelectedMarker(selected);
      setLoadingState(body.markers.length > 0 ? "success" : "empty");
    } catch {
      setLoadingState("error");
    }
  }

  async function handleSelectMarker(marker: WeatherMarker): Promise<void> {
    setSelectedMarker(marker);
    setForecast(null);
    try {
      const response = await fetch(
        `/api/weather/forecast?locationId=${encodeURIComponent(marker.location.id)}&lat=${marker.location.latitude}&lon=${marker.location.longitude}&units=${units}`,
      );
      if (!response.ok) throw new Error("forecast request failed");
      const body = (await response.json()) as ForecastResponse;
      setForecast(body.forecast);
      setSelectedMarker({ ...marker, observation: body.observation });
    } catch {
      setForecast({ locationId: marker.location.id, availability: "unavailable", periods: [], updatedAt: new Date().toISOString() });
    }
  }

  return (
    <div className="weather-shell">
      <SearchControl
        loadingState={searchState}
        results={searchResults}
        onSearch={handleSearch}
        onSelectLocation={(location) => {
          void handleSelectLocation(location);
        }}
      />
      <div className="weather-toolbar">
        <LayerControl activeLayer={activeLayer} onChange={setActiveLayer} />
        <UnitToggle units={units} onChange={setUnits} />
      </div>
      <MapCanvas
        activeLayer={activeLayer}
        loadingState={loadingState}
        markers={markers}
        selectedLocationId={selectedMarker?.location.id}
        onSelectMarker={(marker) => {
          void handleSelectMarker(marker);
        }}
      />
      <WeatherLegend activeLayer={activeLayer} />
      {selectedMarker ? (
        <MarkerDetailPanel
          forecast={forecast ?? undefined}
          marker={selectedMarker}
          units={units}
          onClose={() => {
            setSelectedMarker(null);
          }}
        />
      ) : null}
      {loadingState === "error" ? <StateMessage state="error" title="Weather markers unavailable" /> : null}
    </div>
  );
}