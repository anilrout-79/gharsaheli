/* GharSaheli AI — Service Worker
   Cache-first for the app shell so it opens offline after first load.
   Bump CACHE_VERSION whenever you deploy a new index.html. */
const CACHE_VERSION = 'gharsaheli-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(SHELL).catch(() => {}) // tolerate missing optional files
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;                 // never cache POST (AI proxy etc.)
  const url = new URL(req.url);
  if (url.pathname.indexOf('/api/') === 0) return;  // don't cache API calls

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          // cache same-origin successful responses for next time
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));
      // return cache immediately if present, otherwise wait for network
      return cached || network;
    })
  );
});
