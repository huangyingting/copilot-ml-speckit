import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeatherMapShell } from "@/components/weather-map/weather-map-shell";
import { currentObservation, sanFrancisco } from "../fixtures/weather";

describe("WeatherMapShell current marker flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads markers and opens current details from client state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ markers: [{ location: sanFrancisco, observation: currentObservation }] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );

    render(<WeatherMapShell />);

    await waitFor(() => expect(screen.getByRole("button", { name: /san francisco/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /san francisco/i }));

    expect(screen.getByRole("heading", { name: /san francisco/i })).toBeInTheDocument();
  });
});