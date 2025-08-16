// VeganMapAI Service Worker - Cache Clear Mode
self.skipWaiting();
self.addEventListener('activate', () => self.clients.claim());

// Clear all caches on activation to remove old mock data
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// No caching during cache clear mode
self.addEventListener('fetch', event => {
  // Pass through all requests without caching
  event.respondWith(fetch(event.request));
});