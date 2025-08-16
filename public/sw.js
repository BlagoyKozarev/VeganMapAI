// VeganMapAI Service Worker
const CACHE_NAME = 'veganmapai-v1';
const STATIC_CACHE = 'veganmapai-static-v1';
const DYNAMIC_CACHE = 'veganmapai-dynamic-v1';
const API_CACHE = 'veganmapai-api-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Will be populated by build process
];

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = [
  /^\/api\/restaurants\/public\/map-data/,
  /^\/api\/places/,
  /^\/api\/health/
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /^\/api\/recommend/,
  /^\/api\/feedback/,
  /^\/api\/ai-search/
];

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then(cache => {
        console.log('[SW] API cache ready');
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // Handle navigation requests (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }
  
  // Default: network with cache fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// API request handler with different strategies
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Network-first for real-time data
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.log('[SW] Network failed, trying cache for:', url.pathname);
      return caches.match(request) || new Response(
        JSON.stringify({ error: 'Offline', cached: false }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Cache-first for map data and places
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', url.pathname);
      // Update cache in background
      fetch(request).then(response => {
        if (response.ok) {
          const cache = caches.open(API_CACHE);
          cache.then(c => c.put(request, response.clone()));
        }
      }).catch(() => {});
      
      return cachedResponse;
    }
    
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Offline', restaurants: [] }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Default API handling
  return fetch(request);
}

// Static asset handler
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch asset:', request.url);
    throw error;
  }
}

// Navigation handler for SPA
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Return cached index.html for offline SPA navigation
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('.') && (
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  );
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-feedback') {
    event.waitUntil(syncOfflineFeedback());
  }
  
  if (event.tag === 'background-sync-analytics') {
    event.waitUntil(syncOfflineAnalytics());
  }
});

// Sync offline feedback when back online
async function syncOfflineFeedback() {
  try {
    const cache = await caches.open('offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('feedback')) {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('[SW] Synced offline feedback');
        } catch (error) {
          console.log('[SW] Failed to sync feedback:', error);
        }
      }
    }
  } catch (error) {
    console.log('[SW] Background sync error:', error);
  }
}

// Sync offline analytics
async function syncOfflineAnalytics() {
  try {
    const cache = await caches.open('offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('analytics')) {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('[SW] Synced offline analytics');
        } catch (error) {
          console.log('[SW] Failed to sync analytics:', error);
        }
      }
    }
  } catch (error) {
    console.log('[SW] Analytics sync error:', error);
  }
}

// Push notifications handler
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});