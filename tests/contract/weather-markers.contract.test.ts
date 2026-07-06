import { describe, expect, it, vi } from "vitest";
import { openMeteoCurrentPayload } from "../fixtures/weather";

describe("GET /api/weather/markers contract", () => {
  it("exports nodejs runtime and force-dynamic mode", async () => {
    const route = await import("@/app/api/weather/markers/route");

    expect(route.runtime).toBe("nodejs");
    expect(route.dynamic).toBe("force-dynamic");
  });

  it("returns normalized point markers and cache headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(openMeteoCurrentPayload), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    const { GET } = await import("@/app/api/weather/markers/route");
    const response = await GET(
      new Request("http://localhost/api/weather/markers?bbox=-123,37,-121,38&zoom=6&layer=temperature&units=metric"),
    );
    const body = (await response.json()) as { markers: { location: { id: string }; observation: { freshness: string } }[] };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=300");
    expect(body.markers[0]?.location.id).toBe("san-francisco-us");
    expect(body.markers[0]?.observation.freshness).toBe("current");
  });

  it("returns 400 for invalid query parameters", async () => {
    const { GET } = await import("@/app/api/weather/markers/route");
    const response = await GET(new Request("http://localhost/api/weather/markers?bbox=bad&zoom=6&layer=temperature&units=metric"));

    expect(response.status).toBe(400);
  });
});