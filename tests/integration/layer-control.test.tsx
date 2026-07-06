import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LayerControl } from "@/components/weather-map/layer-control";
import { UnitToggle } from "@/components/weather-map/unit-toggle";
import { WeatherLegend } from "@/components/weather-map/weather-legend";

describe("layer controls and legend", () => {
  it("switches active weather layers", () => {
    const onChange = vi.fn();
    render(<LayerControl activeLayer="temperature" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /wind/i }));

    expect(onChange).toHaveBeenCalledWith("wind");
  });

  it("switches units", () => {
    const onChange = vi.fn();
    render(<UnitToggle units="metric" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /imperial/i }));

    expect(onChange).toHaveBeenCalledWith("imperial");
  });

  it("renders non-color legend cues", () => {
    render(<WeatherLegend activeLayer="precipitation" />);

    expect(screen.getByText(/precipitation/i)).toBeInTheDocument();
    expect(screen.getByText("Droplet")).toBeInTheDocument();
  });
});