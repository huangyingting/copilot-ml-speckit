import { afterEach, describe, expect, it, vi } from "vitest";
import { getServerEnv } from "@/lib/server/env";

describe("server environment", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses Open-Meteo provider defaults", () => {
    vi.stubEnv("NEXT_PUBLIC_MAP_STYLE_URL", "https://demotiles.maplibre.org/style.json");

    expect(getServerEnv()).toMatchObject({
      weatherProvider: "open-meteo",
      geocodingProvider: "open-meteo",
    });
  });

  it("rejects public map style URLs that look secret-bearing", () => {
    vi.stubEnv("NEXT_PUBLIC_MAP_STYLE_URL", "https://tiles.example/style.json?token=secret");

    expect(() => getServerEnv()).toThrow(/secret/i);
  });
});