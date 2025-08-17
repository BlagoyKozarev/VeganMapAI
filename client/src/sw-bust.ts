// Service Worker Cache Busting
declare global {
  interface Window {
    __BUILD_SHA__?: string;
  }
}

// Set build version for cache busting
window.__BUILD_SHA__ = Date.now().toString();

// Clear service worker cache on version change
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      if (registration.active) {
        registration.update();
      }
    });
  });
}

// Force refresh if cache bust is needed
const lastBuildSha = localStorage.getItem('buildSha');
const currentBuildSha = window.__BUILD_SHA__;

if (lastBuildSha && lastBuildSha !== currentBuildSha) {
  localStorage.setItem('buildSha', currentBuildSha);
  console.log('[SW BUST] Cache cleared, new build version:', currentBuildSha);
  // Clear any cached fetch responses
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
} else {
  localStorage.setItem('buildSha', currentBuildSha);
}

export {};