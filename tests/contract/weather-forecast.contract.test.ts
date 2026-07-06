import { describe, expect, it, vi } from "vitest";
import { openMeteoCurrentPayload, openMeteoForecastPayload } from "../fixtures/weather";

describe("GET /api/weather/forecast contract", () => {
  it("exports nodejs runtime and force-dynamic mode", async () => {
    const route = await import("@/app/api/weather/forecast/route");

    expect(route.runtime).toBe("nodejs");
    expect(route.dynamic).toBe("force-dynamic");
  });

  it("returns current observation and at least 24 hours of forecast with cache headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ...openMeteoCurrentPayload, ...openMeteoForecastPayload }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    const { GET } = await import("@/app/api/weather/forecast/route");
    const response = await GET(
      new Request("http://localhost/api/weather/forecast?locationId=paris-fr&lat=48.8566&lon=2.3522&units=metric"),
    );
    const body = (await response.json()) as { forecast: { periods: unknown[]; availability: string } };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=600");
    expect(body.forecast.availability).toBe("available");
    expect(body.forecast.periods.length).toBeGreaterThanOrEqual(24);
  });

  it("returns 400 for invalid coordinates", async () => {
    const { GET } = await import("@/app/api/weather/forecast/route");
    const response = await GET(new Request("http://localhost/api/weather/forecast?locationId=x&lat=bad&lon=2&units=metric"));

    expect(response.status).toBe(400);
  });
});