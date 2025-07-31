const CACHE_NAME = 'veganmapai-v1.0.0';
const STATIC_CACHE = 'veganmapai-static-v1.0.0';
const DYNAMIC_CACHE = 'veganmapai-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/home',
  '/search',
  '/ai-chat',
  '/profile',
  '/manifest.json',
  // External CDN assets
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/restaurants\/nearby/,
  /^\/api\/restaurants\/[^\/]+$/,
  /^\/api\/favorites/,
  /^\/api\/profile/,
  /^\/api\/search\/suggestions/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
      }),
      // Cache external assets with no-cors
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log('[SW] Caching external assets...');
        const externalAssets = STATIC_ASSETS.filter(url => url.startsWith('http'));
        
        for (const url of externalAssets) {
          try {
            const response = await fetch(url, { mode: 'no-cors' });
            await cache.put(url, response);
          } catch (error) {
            console.warn(`[SW] Failed to cache external asset: ${url}`, error);
          }
        }
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/)) {
    // Static assets - Cache first
    event.respondWith(handleStaticAssets(request));
  } else if (url.origin === location.origin) {
    // Navigation requests - Network first with cache fallback
    event.respondWith(handleNavigationRequest(request));
  } else {
    // External requests - Network first
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses for certain endpoints
    if (networkResponse.ok && shouldCacheApiResponse(url.pathname)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      // Clone the response before caching
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Network failed for API request: ${url.pathname}, trying cache...`);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log(`[SW] Serving API response from cache: ${url.pathname}`);
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        message: 'This feature requires an internet connection.',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log(`[SW] Serving static asset from cache: ${request.url}`);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Failed to fetch static asset: ${request.url}`);
    // Return a placeholder or error response for missing assets
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Network failed for navigation: ${request.url}, serving cached page...`);
    
    // Try to serve cached page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try to serve cached root page as fallback
    const rootPage = await caches.match('/');
    if (rootPage) {
      return rootPage;
    }
    
    // Return offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VeganMapAI - Offline</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Open Sans', sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #dcfce7 0%, #ffffff 100%);
              color: #374151;
            }
            .offline-container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 1rem;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              max-width: 400px;
            }
            .icon {
              font-size: 4rem;
              color: #22C55E;
              margin-bottom: 1rem;
            }
            h1 {
              font-family: 'Poppins', sans-serif;
              color: #22C55E;
              margin-bottom: 1rem;
            }
            .retry-btn {
              background: #22C55E;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-family: 'Open Sans', sans-serif;
              font-weight: 500;
              margin-top: 1rem;
              cursor: pointer;
            }
            .retry-btn:hover {
              background: #16A34A;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="icon">🌱</div>
            <h1>VeganMapAI</h1>
            <p>You're currently offline. Please check your internet connection and try again.</p>
            <button class="retry-btn" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Try cache for external resources
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return network error
    return new Response('External resource not available', { status: 503 });
  }
}

// Determine if API response should be cached
function shouldCacheApiResponse(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'background-sync-visits') {
    event.waitUntil(syncVisits());
  } else if (event.tag === 'background-sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync functions for offline data
async function syncFavorites() {
  try {
    // Get pending favorites from IndexedDB or localStorage
    const pendingFavorites = JSON.parse(localStorage.getItem('pendingFavorites') || '[]');
    
    for (const favorite of pendingFavorites) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favorite)
        });
      } catch (error) {
        console.log('[SW] Failed to sync favorite:', error);
      }
    }
    
    // Clear pending favorites after successful sync
    localStorage.removeItem('pendingFavorites');
  } catch (error) {
    console.log('[SW] Background sync failed for favorites:', error);
  }
}

async function syncVisits() {
  try {
    const pendingVisits = JSON.parse(localStorage.getItem('pendingVisits') || '[]');
    
    for (const visit of pendingVisits) {
      try {
        await fetch('/api/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visit)
        });
      } catch (error) {
        console.log('[SW] Failed to sync visit:', error);
      }
    }
    
    localStorage.removeItem('pendingVisits');
  } catch (error) {
    console.log('[SW] Background sync failed for visits:', error);
  }
}

async function syncAnalytics() {
  try {
    const pendingAnalytics = JSON.parse(localStorage.getItem('pendingAnalytics') || '[]');
    
    for (const analytics of pendingAnalytics) {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analytics)
        });
      } catch (error) {
        console.log('[SW] Failed to sync analytics:', error);
      }
    }
    
    localStorage.removeItem('pendingAnalytics');
  } catch (error) {
    console.log('[SW] Background sync failed for analytics:', error);
  }
}

// Handle push notifications (for future implementation)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New vegan restaurants discovered near you!',
      icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f331.png',
      badge: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f331.png',
      vibrate: [200, 100, 200],
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'View Restaurants',
          icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4cd.png'
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/274c.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'VeganMapAI', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service worker loaded');
