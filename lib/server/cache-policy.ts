export const CACHE_TTLS = {
  markers: 300,
  search: 86_400,
  forecast: 600,
} as const;

type CacheEntry<TValue> = {
  value: TValue;
  expiresAt: number;
};

type TtlCacheOptions = {
  now?: () => number;
};

export function createTtlCache<TValue>(options: TtlCacheOptions = {}) {
  const now = options.now ?? Date.now;
  const store = new Map<string, CacheEntry<TValue>>();

  return {
    get(key: string, at = now()): TValue | undefined {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt <= at) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: TValue, ttlSeconds: number): void {
      store.set(key, { value, expiresAt: now() + ttlSeconds * 1_000 });
    },
    clear(): void {
      store.clear();
    },
  };
}

const inFlight = new Map<string, Promise<unknown>>();

export async function dedupeInFlight<TValue>(key: string, load: () => Promise<TValue>): Promise<TValue> {
  const existing = inFlight.get(key) as Promise<TValue> | undefined;
  if (existing) return existing;

  const pending = load().finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, pending);
  return pending;
}