import { describe, expect, it } from "vitest";
import { getDefaultPreference, setActiveLayer, setUnits } from "@/lib/weather/preferences";

describe("weather layer preferences", () => {
  it("defaults to temperature and metric units", () => {
    expect(getDefaultPreference()).toEqual({ activeLayer: "temperature", units: "metric" });
  });

  it("updates active layer and units immutably", () => {
    const preference = getDefaultPreference();

    expect(setActiveLayer(preference, "wind")).toEqual({ activeLayer: "wind", units: "metric" });
    expect(setUnits(preference, "imperial")).toEqual({ activeLayer: "temperature", units: "imperial" });
  });
});