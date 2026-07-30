const CACHE = 'bob-hub-v5';  // bumped version to clear old cache
self.addEventListener('install', e => {
  e.waitUntil(caches.delete('bob-hub-v1').then(() => caches.delete('bob-hub-v4')).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.status === 200) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
      return res;
    }))
  );
});
