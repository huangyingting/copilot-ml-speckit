"use client";

import type { WeatherLayerId } from "@/lib/weather/schemas";

const layers: { id: WeatherLayerId; label: string }[] = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "wind", label: "Wind" },
  { id: "cloud", label: "Cloud" },
];

type LayerControlProps = {
  activeLayer: WeatherLayerId;
  onChange: (layer: WeatherLayerId) => void;
};

export function LayerControl({ activeLayer, onChange }: LayerControlProps) {
  return (
    <section className="segmented-control" aria-label="Weather layer">
      {layers.map((layer) => (
        <button
          aria-pressed={activeLayer === layer.id}
          key={layer.id}
          type="button"
          onClick={() => {
            onChange(layer.id);
          }}
        >
          {layer.label}
        </button>
      ))}
    </section>
  );
}