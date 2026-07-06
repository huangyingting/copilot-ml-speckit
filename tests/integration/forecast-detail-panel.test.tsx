import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkerDetailPanel } from "@/components/weather-map/marker-detail-panel";
import { currentObservation, paris, sanFrancisco } from "../fixtures/weather";
import type { WeatherForecast } from "@/lib/weather/schemas";

const forecast: WeatherForecast = {
  locationId: paris.id,
  availability: "available",
  updatedAt: "2026-07-07T12:00:00Z",
  periods: [
    { startsAt: "2026-07-07T13:00:00Z", temperature: 25, condition: "Clear", precipitationProbabilityPercent: 5, windSpeed: 7, cloudCoveragePercent: 10 },
  ],
};

describe("forecast detail panel", () => {
  it("renders available forecast details", () => {
    render(
      <MarkerDetailPanel
        marker={{ location: paris, observation: { ...currentObservation, locationId: paris.id } }}
        units="metric"
        forecast={forecast}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText(/24-hour forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  it("renders unavailable forecast state", () => {
    render(<MarkerDetailPanel marker={{ location: sanFrancisco, observation: currentObservation }} units="metric" forecast={{ ...forecast, availability: "unavailable", periods: [] }} onClose={vi.fn()} />);

    expect(screen.getByText(/forecast unavailable/i)).toBeInTheDocument();
  });
});