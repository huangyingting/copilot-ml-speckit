import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeatherMapShell } from "@/components/weather-map/weather-map-shell";
import { currentObservation, paris, sanFrancisco } from "../fixtures/weather";

describe("WeatherMapShell search flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("centers search selection and opens marker details", async () => {
    const parisObservation = { ...currentObservation, locationId: paris.id, temperature: 24, condition: "Clear" };
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/api/weather/search")) {
        return Promise.resolve(new Response(JSON.stringify({ results: [paris] }), { status: 200 }));
      }
      if (url.includes("bbox=2.102")) {
        return Promise.resolve(new Response(JSON.stringify({ markers: [{ location: paris, observation: parisObservation }] }), { status: 200 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ markers: [{ location: sanFrancisco, observation: currentObservation }] }), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WeatherMapShell />);

    await waitFor(() => expect(screen.getByRole("button", { name: /san francisco/i })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("searchbox", { name: /search location/i }), { target: { value: "Paris" } });
    fireEvent.click(screen.getByRole("button", { name: /^search$/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /paris, france/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /paris, france/i }));

    await waitFor(() => expect(screen.getByRole("heading", { name: /paris/i })).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("bbox=2.1022"));
  });
});