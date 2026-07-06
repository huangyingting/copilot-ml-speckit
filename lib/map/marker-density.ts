type RankedMarker = {
  location: {
    id: string;
    name: string;
    rank?: number | undefined;
  };
};

export function getMarkerLimitForZoom(zoom: number): number {
  if (zoom < 3) return 24;
  if (zoom < 5) return 48;
  if (zoom < 8) return 80;
  return 140;
}

export function selectMarkersForDensity<TMarker extends RankedMarker>(markers: TMarker[], zoom: number): TMarker[] {
  return [...markers]
    .sort((left, right) => {
      const rankDelta = (left.location.rank ?? Number.MAX_SAFE_INTEGER) - (right.location.rank ?? Number.MAX_SAFE_INTEGER);
      if (rankDelta !== 0) return rankDelta;
      return left.location.name.localeCompare(right.location.name);
    })
    .slice(0, getMarkerLimitForZoom(zoom));
}