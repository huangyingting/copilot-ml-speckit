import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MapCanvas } from "@/components/weather-map/map-canvas";
import { currentObservation, sanFrancisco } from "../fixtures/weather";

const marker = { location: sanFrancisco, observation: currentObservation };

describe("MapCanvas current weather markers", () => {
  it("shows loading, empty, and error states", () => {
    const { rerender } = render(<MapCanvas markers={[]} loadingState="loading" activeLayer="temperature" onSelectMarker={vi.fn()} />);
    expect(screen.getByText(/loading weather markers/i)).toBeInTheDocument();

    rerender(<MapCanvas markers={[]} loadingState="empty" activeLayer="temperature" onSelectMarker={vi.fn()} />);
    expect(screen.getByText(/no weather markers/i)).toBeInTheDocument();

    rerender(<MapCanvas markers={[]} loadingState="error" activeLayer="temperature" onSelectMarker={vi.fn()} />);
    expect(screen.getByText(/map data unavailable/i)).toBeInTheDocument();
  });

  it("renders selectable point markers", () => {
    const onSelectMarker = vi.fn();
    render(<MapCanvas markers={[marker]} loadingState="success" activeLayer="temperature" onSelectMarker={onSelectMarker} />);

    fireEvent.click(screen.getByRole("button", { name: /san francisco/i }));

    expect(onSelectMarker).toHaveBeenCalledWith(marker);
  });
});