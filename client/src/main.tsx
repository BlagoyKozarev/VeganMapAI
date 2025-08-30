import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BUILD_SHA } from "./build";

import { gaInit } from './lib/analytics';

// Initialize Google Analytics 4
gaInit();

// Force clear Service Worker and cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
  // @ts-ignore
  caches?.keys?.().then(keys => keys.forEach(k => caches.delete(k)));
}

console.log('[SW CLEAR] Cache cleared, build:', BUILD_SHA);

console.log('[MAIN] React app loading...');
createRoot(document.getElementById("root")!).render(<App />);

// Manual Service Worker Registration for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}
