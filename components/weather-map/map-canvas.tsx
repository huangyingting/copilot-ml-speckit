"use client";

import { useEffect, useRef } from "react";
import { StateMessage } from "@/components/ui/state-message";
import type { LoadingState, WeatherLayerId, WeatherMarker } from "@/lib/weather/schemas";

type MapCanvasProps = {
  markers: WeatherMarker[];
  loadingState: LoadingState;
  activeLayer: WeatherLayerId;
  selectedLocationId?: string | undefined;
  onSelectMarker: (marker: WeatherMarker) => void;
};

export function MapCanvas({ markers, loadingState, activeLayer, selectedLocationId, onSelectMarker }: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    void import("maplibre-gl")
      .then(() => {
        if (!disposed && mapRef.current) {
          mapRef.current.dataset.maplibre = "ready";
        }
      })
      .catch(() => {
        if (!disposed && mapRef.current) {
          mapRef.current.dataset.maplibre = "unavailable";
        }
      });

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <section className="map-canvas" aria-label="Interactive world weather map" data-testid="weather-map">
      <div className="map-canvas__viewport" ref={mapRef}>
        <div className="map-canvas__grid" aria-hidden="true" />
        <p className="map-canvas__layer">Active layer: {activeLayer}</p>
        {loadingState === "loading" ? <StateMessage state="loading" title="Loading weather markers" /> : null}
        {loadingState === "empty" ? <StateMessage state="empty" title="No weather markers" message="Try another part of the world." /> : null}
        {loadingState === "error" ? <StateMessage state="error" title="Map data unavailable" message="Weather markers could not be loaded." /> : null}
        <div className="map-canvas__markers" aria-label="Weather markers">
          {markers.map((marker) => (
            <button
              className={`weather-marker${selectedLocationId === marker.location.id ? " weather-marker--selected" : ""}`}
              data-layer={activeLayer}
              key={marker.location.id}
              onClick={() => {
                onSelectMarker(marker);
              }}
              style={{
                left: `${((marker.location.longitude + 180) / 360) * 100}%`,
                top: `${((90 - marker.location.latitude) / 180) * 100}%`,
              }}
              type="button"
              aria-label={`${marker.location.name} ${Math.round(marker.observation.temperature)} degrees ${marker.observation.condition}`}
            >
              <span>{Math.round(marker.observation.temperature)}°</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}