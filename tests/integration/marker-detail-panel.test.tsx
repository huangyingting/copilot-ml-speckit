import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkerDetailPanel } from "@/components/weather-map/marker-detail-panel";
import { currentObservation, sanFrancisco } from "../fixtures/weather";

describe("MarkerDetailPanel", () => {
  it("shows selected current observation fields and freshness", () => {
    render(<MarkerDetailPanel marker={{ location: sanFrancisco, observation: currentObservation }} units="metric" onClose={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /san francisco/i })).toBeInTheDocument();
    expect(screen.getByText("18°C")).toBeInTheDocument();
    expect(screen.getByText(/partly cloudy/i)).toBeInTheDocument();
    expect(screen.getByText(/76%/i)).toBeInTheDocument();
    expect(screen.getByText(/12 km\/h/i)).toBeInTheDocument();
    expect(screen.getByText(/current/i)).toBeInTheDocument();
  });

  it("supports closing the detail panel", () => {
    const onClose = vi.fn();
    render(<MarkerDetailPanel marker={{ location: sanFrancisco, observation: currentObservation }} units="metric" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});