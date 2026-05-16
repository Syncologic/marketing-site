const counters = new Map<string, number>();
const sets = new Map<string, Set<string>>();
const expiries = new Map<string, number>();

function checkExpiry(key: string): void {
  const exp = expiries.get(key);
  if (exp !== undefined && exp < Date.now()) {
    counters.delete(key);
    sets.delete(key);
    expiries.delete(key);
  }
}

export function createDevKv() {
  return {
    async incr(key: string): Promise<number> {
      checkExpiry(key);
      const next = (counters.get(key) ?? 0) + 1;
      counters.set(key, next);
      return next;
    },
    async expire(key: string, seconds: number): Promise<number> {
      expiries.set(key, Date.now() + seconds * 1000);
      return 1;
    },
    async sadd(key: string, ...members: string[]): Promise<number> {
      checkExpiry(key);
      let s = sets.get(key);
      if (!s) {
        s = new Set();
        sets.set(key, s);
      }
      let added = 0;
      for (const m of members) {
        if (!s.has(m)) {
          s.add(m);
          added++;
        }
      }
      return added;
    },
    async scard(key: string): Promise<number> {
      checkExpiry(key);
      return sets.get(key)?.size ?? 0;
    },
  };
}
