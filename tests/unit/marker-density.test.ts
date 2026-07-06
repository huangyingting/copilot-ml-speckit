import { describe, expect, it } from "vitest";
import { getMarkerLimitForZoom, selectMarkersForDensity } from "@/lib/map/marker-density";
import { paris, sanFrancisco } from "../fixtures/weather";

describe("marker density", () => {
  it("increases marker limits as users zoom in", () => {
    expect(getMarkerLimitForZoom(2)).toBeLessThan(getMarkerLimitForZoom(7));
  });

  it("selects deterministic ranked markers within the zoom limit", () => {
    const markers = [
      { location: { ...paris, rank: 5 }, observation: { locationId: paris.id, temperature: 22 } },
      { location: { ...sanFrancisco, rank: 1 }, observation: { locationId: sanFrancisco.id, temperature: 18 } },
    ];

    expect(selectMarkersForDensity(markers, 1)[0]?.location.id).toBe("san-francisco-us");
  });
});