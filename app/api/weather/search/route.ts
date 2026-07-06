import { NextResponse } from "next/server";
import { createSearchCacheKey } from "@/lib/map/viewport";
import { CACHE_TTLS, createTtlCache, dedupeInFlight } from "@/lib/server/cache-policy";
import { searchOpenMeteoLocations } from "@/lib/server/geocoding-provider";
import { getServerEnv } from "@/lib/server/env";
import type { Location } from "@/lib/weather/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchResponse = {
  query: string;
  results: Location[];
};

const searchCache = createTtlCache<SearchResponse>();

export async function GET(request: Request) {
  getServerEnv();
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const limit = Number(url.searchParams.get("limit") ?? 8);

  if (query.length === 0 || Number.isNaN(limit) || limit < 1 || limit > 20) {
    return NextResponse.json({ error: "invalid search query" }, { status: 400 });
  }

  const cacheKey = createSearchCacheKey(query, limit);
  const cached = searchCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: { "cache-control": "public, max-age=86400" } });
  }

  const body = await dedupeInFlight(cacheKey, async () => {
    const results = await searchOpenMeteoLocations(query, limit);
    const responseBody = { query, results };
    searchCache.set(cacheKey, responseBody, CACHE_TTLS.search);
    return responseBody;
  });

  return NextResponse.json(body, { headers: { "cache-control": "public, max-age=86400" } });
}