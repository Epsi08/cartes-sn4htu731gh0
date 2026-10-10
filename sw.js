// Service Worker — offline cache.
// App shell: network first, but give up after NETWORK_TIMEOUT_MS and serve the cached copy,
// so a one-bar signal at the checkout never leaves the app hanging. Static assets: cache first.
const CACHE = 'mes-cartes-v4';
const NETWORK_TIMEOUT_MS = 2500;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './JsBarcode.all.min.js',
  './zxing.min.js'
];

self.addEventListener('install', (e) => {
  // One by one: addAll() is all-or-nothing, so a single failed file used to leave nothing cached.
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate' || req.url.endsWith('/index.html')) {
    const fromNetwork = fetch(req).then(resp => {
      // Never cache an error page (e.g. a GitHub Pages 404 during a deploy) as the app shell
      if (resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return resp;
    });
    const fromCache = () => caches.match(req).then(r => r || caches.match('./index.html'));
    const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS));

    e.respondWith(
      Promise.race([fromNetwork, timeout.then(fromCache)])
        .then(resp => resp || fromNetwork)
        .catch(() => fromCache())
        .then(resp => resp || fromNetwork)
    );
    e.waitUntil(fromNetwork.catch(() => {}));   // still refresh the cache in the background
    return;
  }

  // Static assets: cache first
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (resp && resp.status === 200 && req.url.startsWith('http')) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
