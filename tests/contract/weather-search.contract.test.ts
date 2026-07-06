import { describe, expect, it, vi } from "vitest";

const geocodingPayload = {
  results: [
    {
      id: 2988507,
      name: "Paris",
      country: "France",
      admin1: "Ile-de-France",
      latitude: 48.8566,
      longitude: 2.3522,
      timezone: "Europe/Paris",
    },
  ],
};

describe("GET /api/weather/search contract", () => {
  it("exports nodejs runtime and force-dynamic mode", async () => {
    const route = await import("@/app/api/weather/search/route");

    expect(route.runtime).toBe("nodejs");
    expect(route.dynamic).toBe("force-dynamic");
  });

  it("returns distinguishable normalized location results with cache headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(geocodingPayload), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    const { GET } = await import("@/app/api/weather/search/route");
    const response = await GET(new Request("http://localhost/api/weather/search?q=Paris&limit=8"));
    const body = (await response.json()) as { results: { id: string; country?: string; region?: string }[] };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=86400");
    expect(body.results[0]).toMatchObject({ id: "paris-fr", country: "France", region: "Ile-de-France" });
  });

  it("returns 400 for empty queries", async () => {
    const { GET } = await import("@/app/api/weather/search/route");
    const response = await GET(new Request("http://localhost/api/weather/search?q="));

    expect(response.status).toBe(400);
  });
});