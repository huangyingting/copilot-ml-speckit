"use client";

import { formatTemperature, formatWindSpeed } from "@/lib/weather/units";
import type { Units, WeatherForecast, WeatherMarker } from "@/lib/weather/schemas";

type MarkerDetailPanelProps = {
  marker: WeatherMarker;
  units: Units;
  forecast?: WeatherForecast | undefined;
  onClose: () => void;
};

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function MarkerDetailPanel({ marker, units, forecast, onClose }: MarkerDetailPanelProps) {
  const { location, observation } = marker;

  return (
    <aside className="detail-panel" aria-label={`${location.name} weather details`}>
      <button className="detail-panel__close" type="button" onClick={onClose} aria-label="Close weather details">
        ×
      </button>
      <p className="detail-panel__eyebrow">{location.country ?? "Selected location"}</p>
      <h2>{location.name}</h2>
      <div className="detail-panel__temperature">{formatTemperature(observation.temperature, units)}</div>
      <p>{observation.condition}</p>
      <dl className="detail-panel__stats">
        <div>
          <dt>Humidity</dt>
          <dd>{observation.humidityPercent ?? "—"}%</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>{observation.windSpeed === undefined ? "—" : formatWindSpeed(observation.windSpeed, units)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatUpdatedAt(observation.receivedAt)}</dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>{observation.freshness}</dd>
        </div>
      </dl>
      <section className="forecast-panel" aria-label="Forecast">
        <h3>24-hour forecast</h3>
        {!forecast || forecast.availability === "unavailable" ? (
          <p>Forecast unavailable</p>
        ) : (
          <ul>
            {forecast.periods.slice(0, 4).map((period) => (
              <li key={period.startsAt}>
                <span>{formatUpdatedAt(period.startsAt)}</span>
                <strong>{period.temperature === undefined ? "—" : formatTemperature(period.temperature, units)}</strong>
                <span>{period.condition ?? "Unavailable"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}