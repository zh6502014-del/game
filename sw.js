/* Nightfall Duel asset cache. Only same-origin /assets/ media is handled (pages, JS and CSS keep their ?v= versioning).
   Cache-first for instant loads; each file is revalidated once per service-worker lifetime so replaced art still arrives. */
const CACHE = 'nd-assets-v1';
const revalidated = new Set();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('nd-assets-') && key !== CACHE) await caches.delete(key);
  await self.clients.claim();
})()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.includes('/assets/') || url.pathname.endsWith('.json')) return;
  event.respondWith(handle(req, url, event));
});

async function fromNetwork(key, cache) {
  const res = await fetch(key);
  if (res.ok && res.status === 200) { try { await cache.put(key, res.clone()); } catch (e) { /* quota */ } }
  return res;
}

async function ranged(res, range) {
  const m = /bytes=(\d*)-(\d*)/.exec(range || '');
  if (!m || res.status !== 200) return res;
  const buf = await res.arrayBuffer();
  const len = buf.byteLength;
  let start = m[1] === '' ? Math.max(0, len - Number(m[2])) : Number(m[1]);
  let end = m[1] === '' || m[2] === '' ? len - 1 : Math.min(Number(m[2]), len - 1);
  if (start > end || start >= len) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${len}` } });
  return new Response(buf.slice(start, end + 1), { status: 206, headers: {
    'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
    'Content-Range': `bytes ${start}-${end}/${len}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}

async function handle(req, url, event) {
  const cache = await caches.open(CACHE);
  const key = url.origin + url.pathname;
  const range = req.headers.get('range');
  try {
    const hit = await cache.match(key);
    if (hit) {
      if (!revalidated.has(key)) {
        revalidated.add(key);
        event.waitUntil(fromNetwork(key, cache).catch(() => {}));
      }
      return range ? ranged(hit, range) : hit;
    }
    const res = await fromNetwork(key, cache);
    return range ? ranged(res, range) : res;
  } catch (e) {
    return fetch(req);
  }
}
