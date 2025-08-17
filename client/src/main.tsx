import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BUILD_SHA } from "./build";

// Fix Leaflet icon paths for Vite
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// Force clear Service Worker and cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
  // @ts-ignore
  caches?.keys?.().then(keys => keys.forEach(k => caches.delete(k)));
}

console.log('[SW CLEAR] Cache cleared, build:', BUILD_SHA);

console.log('[MAIN] React app loading...');
createRoot(document.getElementById("root")!).render(<App />);
