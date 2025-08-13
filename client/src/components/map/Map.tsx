import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '@shared/schema';

// Dynamic import for MarkerCluster to handle loading issues
// Import MarkerCluster directly - it's already in dependencies
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

let clusterPluginLoaded = true; // Set to true since we're importing directly

console.log('[Map] MarkerCluster plugin loaded via direct import');
// Helper functions for data normalization
const normalizeList = (input: any): Restaurant[] => {
  if (Array.isArray(input)) return input;
  if (input?.data && Array.isArray(input.data)) return input.data;
  if (input?.items && Array.isArray(input.items)) return input.items;
  return [];
};

const getLatLng = (restaurant: any): [number, number] | null => {
  // Try different property names for latitude/longitude
  let lat: number, lng: number;
  
  if (restaurant.lat !== undefined && restaurant.lng !== undefined) {
    lat = parseFloat(restaurant.lat);
    lng = parseFloat(restaurant.lng);
  } else if (restaurant.latitude !== undefined && restaurant.longitude !== undefined) {
    lat = parseFloat(restaurant.latitude);
    lng = parseFloat(restaurant.longitude);
  } else if (restaurant.location?.lat !== undefined && restaurant.location?.lng !== undefined) {
    lat = parseFloat(restaurant.location.lat);
    lng = parseFloat(restaurant.location.lng);
  } else {
    return null;
  }
  
  if (isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
};

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
interface MapProps {
  center: [number, number];
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant, event?: any) => void;
  onLocationChange?: (center: [number, number]) => void;
  loading?: boolean;
}
export default function Map({ center, restaurants, onRestaurantClick, loading }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  // Initialize map once
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      // MarkerCluster plugin is already loaded via direct import
      
      const map = L.map(mapRef.current, {
        center: center,
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: 'center',
        boxZoom: false,
        keyboard: false,
        dragging: true,
        renderer: L.canvas({ tolerance: 15 })
      });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
      }).addTo(map);
      
      // Add user location marker
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative">
            <div class="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
            <div class="absolute -inset-2 border-2 border-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker(center, { icon: userIcon }).addTo(map);
      
      // Create cluster group or fallback layer group
      let clusterGroup: any;
      
      if (clusterPluginLoaded && typeof (L as any).markerClusterGroup === 'function') {
        console.log('[Map] Creating MarkerClusterGroup');
        clusterGroup = (L as any).markerClusterGroup({
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          maxClusterRadius: 50,
          iconCreateFunction: function(cluster: any) {
            const childCount = cluster.getChildCount();
            let className, size;
            
            if (childCount <= 20) {
              className = 'vg-cluster vg-cl-small';
              size = 35;
            } else if (childCount <= 50) {
              className = 'vg-cluster vg-cl-medium'; 
              size = 45;
            } else {
              className = 'vg-cluster vg-cl-large';
              size = 55;
            }
            
            return L.divIcon({
              html: `<div class="${className}"><span>${childCount}</span></div>`,
              className: 'vg-cluster-marker',
              iconSize: [size, size],
              iconAnchor: [size/2, size/2]
            });
          }
        });
      } else {
        console.warn('[Map] MarkerCluster library not loaded! Falling back to regular markers.');
        clusterGroup = L.layerGroup();
      }
      
      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
      mapInstanceRef.current = map;
    };
    
    initializeMap();
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      clusterGroupRef.current = null;
    };
  }, []);
  // Update markers when restaurants data changes
  useEffect(() => {
    if (!clusterGroupRef.current || !restaurants.length) return;
    
    const cluster = clusterGroupRef.current;
    const normalizedRestaurants = normalizeList(restaurants);
    
    console.log(`[Map] Updating markers for ${normalizedRestaurants.length} restaurants`);
    
    // Clear existing markers
    cluster.clearLayers();
    
    // Create markers array
    const markers: L.Marker[] = [];
    
    normalizedRestaurants.forEach((restaurant) => {
      const coords = getLatLng(restaurant);
      if (!coords) return;
      
      const [lat, lng] = coords;
      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      const displayScore = veganScore > 0 ? veganScore.toFixed(1) : '?';
      
      // Create restaurant marker
      const restaurantIcon = L.divIcon({
        className: 'restaurant-marker-leaflet',
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            background: #22c55e; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 600;
            font-size: 8px;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          " 
          onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 16px rgba(34,197,94,0.4)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'"
          title="${restaurant.name} - Vegan Score: ${veganScore}/10">
            ${displayScore}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      
      const marker = L.marker([lat, lng], { 
        icon: restaurantIcon,
        riseOnHover: true
      });
      
      // Add click handler with existing logic
      marker.on('click', (e) => {
        onRestaurantClick(restaurant, e);
      });
      
      markers.push(marker);
    });
    
    // Add all markers to cluster at once (or layer group if no clustering)
    if (markers.length > 0) {
      if (cluster.addLayers && typeof cluster.addLayers === 'function') {
        // It's a cluster group
        cluster.addLayers(markers);
        console.log(`[Map] Added ${markers.length} markers to cluster group`);
      } else {
        // It's a regular layer group
        markers.forEach(marker => cluster.addLayer(marker));
        console.log(`[Map] Added ${markers.length} markers to layer group (no clustering)`);
      }
    }
    
  }, [restaurants, onRestaurantClick]);
  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full map-container" />
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      )}
    </div>
  );
}