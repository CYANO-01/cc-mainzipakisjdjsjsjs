// BIN Lookup — proxied through our backend to avoid CORS and handle rate limiting.
// Results are cached in-memory for the session (same BIN = same bank).

export interface BinInfo {
  exists: boolean;
  bank?: string;
  country?: string;
  cardType?: string;  // debit | credit | prepaid
  brand?: string;
}

// ─── Session cache ────────────────────────────────────────────────────────────
const cache = new Map<string, BinInfo>();

// ─── Rate limiter — max 1 inflight request at a time ──────────────────────────
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 120; // ~8 req/s safely under binlist.net 10 req/s limit

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Lookup ───────────────────────────────────────────────────────────────────
export async function lookupBin(
  cardNumber: string,
  signal?: AbortSignal
): Promise<BinInfo> {
  const bin = cardNumber.replace(/\D/g, '').substring(0, 8);
  if (bin.length < 6) return { exists: false };

  const cacheKey = bin.substring(0, 8);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // Rate-limit
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await sleep(MIN_INTERVAL_MS - elapsed);
  }

  lastRequestTime = Date.now();

  try {
    const res = await fetch(`/api/bin-lookup/${bin.substring(0, 8)}`, {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      // 404 = BIN not found in database
      if (res.status === 404) {
        const info: BinInfo = { exists: false };
        cache.set(cacheKey, info);
        return info;
      }
      // Other errors — treat as unknown (don't penalize)
      return { exists: true };
    }

    const data = await res.json();
    const info: BinInfo = {
      exists: true,
      bank:     data.bank?.name,
      country:  data.country?.name,
      cardType: data.type?.toLowerCase(),
      brand:    data.brand,
    };
    cache.set(cacheKey, info);
    return info;

  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    // Network error / API down — don't penalize the card
    return { exists: true };
  }
}

export function clearBinCache() {
  cache.clear();
}
