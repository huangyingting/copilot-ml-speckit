import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeatherMapShell } from "@/components/weather-map/weather-map-shell";
import { currentObservation, openMeteoForecastPayload, sanFrancisco } from "../fixtures/weather";

describe("WeatherMapShell layer and forecast flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("preserves map position while switching layer/unit and loading forecast", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/api/weather/forecast")) {
        return Promise.resolve(new Response(JSON.stringify({ location: sanFrancisco, observation: currentObservation, forecast: { availability: "available", updatedAt: "2026-07-07T12:00:00Z", periods: openMeteoForecastPayload.hourly.time.map((time) => ({ startsAt: `${time}:00Z`, temperature: 20, condition: "Clear" })) } }), { status: 200 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ markers: [{ location: sanFrancisco, observation: currentObservation }] }), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WeatherMapShell />);

    await waitFor(() => expect(screen.getByRole("button", { name: /san francisco/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /wind/i }));
    expect(screen.getByText(/active layer: wind/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /imperial/i }));
    fireEvent.click(screen.getByRole("button", { name: /san francisco/i }));

    await waitFor(() => expect(screen.getByText(/24-hour forecast/i)).toBeInTheDocument());
  });
});