type CacheEntry<T> = { value: T; expiresAt: number };
const store = new Map<string, CacheEntry<any>>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export function cacheGet<T>(key: string): T | null {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) { 
    store.delete(key); 
    return null; 
  }
  return e.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number = TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function makeKeyFromBBox(b: { n: number; s: number; e: number; w: number }, extra?: string) {
  return `bbox:${b.n.toFixed(4)}:${b.s.toFixed(4)}:${b.e.toFixed(4)}:${b.w.toFixed(4)}:${extra ?? ""}`;
}

// Clear expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) {
      store.delete(key);
    }
  }
}, TTL_MS); // Clean every 5 minutes