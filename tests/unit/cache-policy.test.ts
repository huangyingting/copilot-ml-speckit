import { describe, expect, it, vi } from "vitest";
import { CACHE_TTLS, createTtlCache, dedupeInFlight } from "@/lib/server/cache-policy";

describe("cache policy", () => {
  it("defines TTLs from the route contracts", () => {
    expect(CACHE_TTLS.markers).toBe(300);
    expect(CACHE_TTLS.search).toBe(86_400);
    expect(CACHE_TTLS.forecast).toBe(600);
  });

  it("expires values after their TTL", () => {
    const cache = createTtlCache<string>({ now: () => 1_000 });
    cache.set("key", "value", 5);

    expect(cache.get("key", 4_000)).toBe("value");
    expect(cache.get("key", 7_000)).toBeUndefined();
  });

  it("deduplicates in-flight requests by key", async () => {
    const load = vi.fn(() => Promise.resolve("loaded"));
    const [first, second] = await Promise.all([dedupeInFlight("same", load), dedupeInFlight("same", load)]);

    expect(first).toBe("loaded");
    expect(second).toBe("loaded");
    expect(load).toHaveBeenCalledTimes(1);
  });
});