import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LayerControl } from "@/components/weather-map/layer-control";
import { SearchControl } from "@/components/weather-map/search-control";
import { UnitToggle } from "@/components/weather-map/unit-toggle";
import { WeatherLegend } from "@/components/weather-map/weather-legend";
import { paris } from "../fixtures/weather";

describe("cross-story accessibility", () => {
  it("exposes primary map controls with semantic labels", () => {
    render(
      <>
        <SearchControl loadingState="success" results={[paris]} onSearch={vi.fn()} onSelectLocation={vi.fn()} />
        <LayerControl activeLayer="temperature" onChange={vi.fn()} />
        <UnitToggle units="metric" onChange={vi.fn()} />
        <WeatherLegend activeLayer="temperature" />
      </>,
    );

    expect(screen.getByRole("searchbox", { name: /search location/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /weather layer/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /measurement units/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /temperature legend/i })).toBeInTheDocument();
  });
});