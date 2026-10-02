// Úložiště v paměti se stejným chováním jako Netlify Blobs (včetně podmíněného
// zápisu přes ETag). Pro testy a lokální `npm run dev:mock`.

export function createMemoryStore() {
  const data = new Map(); // key → { value, etag }
  let version = 0;

  return {
    async get(key) {
      return data.has(key) ? structuredClone(data.get(key).value) : null;
    },
    async getWithMetadata(key) {
      if (!data.has(key)) return null;
      const entry = data.get(key);
      return { data: structuredClone(entry.value), etag: entry.etag, metadata: {} };
    },
    async setJSON(key, value, { onlyIfMatch, onlyIfNew } = {}) {
      const current = data.get(key);
      if (onlyIfNew && current) return { modified: false };
      if (onlyIfMatch && current?.etag !== onlyIfMatch) return { modified: false };
      const etag = `"${++version}"`;
      data.set(key, { value: structuredClone(value), etag });
      return { modified: true, etag };
    },
    async delete(key) {
      data.delete(key);
    },
  };
}
