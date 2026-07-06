"use client";

import type { WeatherLayerId } from "@/lib/weather/schemas";

const legendCues: Record<WeatherLayerId, { title: string; cues: string[] }> = {
  temperature: { title: "Temperature", cues: ["Cool dot", "Mild dot", "Warm dot"] },
  precipitation: { title: "Precipitation", cues: ["Dry circle", "Droplet", "Heavy droplet"] },
  wind: { title: "Wind", cues: ["Calm dot", "Arrow", "Fast arrow"] },
  cloud: { title: "Cloud", cues: ["Clear ring", "Broken ring", "Filled ring"] },
};

type WeatherLegendProps = {
  activeLayer: WeatherLayerId;
};

export function WeatherLegend({ activeLayer }: WeatherLegendProps) {
  const legend = legendCues[activeLayer];

  return (
    <section className="weather-legend" aria-label={`${legend.title} legend`}>
      <h2>{legend.title}</h2>
      <ul>
        {legend.cues.map((cue) => (
          <li key={cue}>{cue}</li>
        ))}
      </ul>
    </section>
  );
}