"use client";

import type { Units } from "@/lib/weather/schemas";

type UnitToggleProps = {
  units: Units;
  onChange: (units: Units) => void;
};

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  return (
    <section className="segmented-control" aria-label="Measurement units">
      {(["metric", "imperial"] as const).map((unit) => (
        <button
          aria-pressed={units === unit}
          key={unit}
          type="button"
          onClick={() => {
            onChange(unit);
          }}
        >
          {unit === "metric" ? "Metric" : "Imperial"}
        </button>
      ))}
    </section>
  );
}