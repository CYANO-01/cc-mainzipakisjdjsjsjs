import { Router } from "express";

const router = Router();

// Simple in-process cache: bin → response body + timestamp
const binCache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

router.get("/bin-lookup/:bin", async (req, res) => {
  const { bin } = req.params;

  // Validate BIN — 6 to 8 digits only
  if (!/^\d{6,8}$/.test(bin)) {
    res.status(400).json({ error: "Invalid BIN" });
    return;
  }

  // Serve from cache if fresh
  const cached = binCache.get(bin);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    if (cached.data === null) {
      res.status(404).json({ error: "BIN not found" });
    } else {
      res.json(cached.data);
    }
    return;
  }

  try {
    const upstream = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: {
        "Accept-Version": "3",
        "User-Agent": "cc-checker/1.0",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (upstream.status === 404) {
      binCache.set(bin, { data: null, ts: Date.now() });
      res.status(404).json({ error: "BIN not found" });
      return;
    }

    if (!upstream.ok) {
      // binlist.net rate-limited or down — return 200 with empty so frontend
      // doesn't penalize the card
      res.status(200).json({});
      return;
    }

    const data = await upstream.json() as unknown;
    binCache.set(bin, { data, ts: Date.now() });
    res.json(data);
  } catch {
    // Upstream error → don't block the card check
    res.status(200).json({});
  }
});

export default router;
