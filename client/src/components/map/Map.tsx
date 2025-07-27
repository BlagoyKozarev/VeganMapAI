import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RestaurantPin from './RestaurantPin';
import type { Restaurant } from '@shared/schema';

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
  onRestaurantClick: (restaurant: Restaurant) => void;
  loading?: boolean;
}

export default function Map({ center, restaurants, onRestaurantClick, loading }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer
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

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Helper function to cluster nearby restaurants
  const clusterRestaurants = (restaurants: Restaurant[], distance: number) => {
    const clusters: { representative: Restaurant; count: number; restaurants: Restaurant[] }[] = [];
    const processed = new Set<string>();

    restaurants.forEach(restaurant => {
      if (processed.has(restaurant.id)) return;

      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const nearbyRestaurants = restaurants.filter(other => {
        if (processed.has(other.id) || other.id === restaurant.id) return false;
        
        const otherLat = parseFloat(other.latitude);
        const otherLng = parseFloat(other.longitude);
        
        if (isNaN(otherLat) || isNaN(otherLng)) return false;
        
        const dist = Math.sqrt(Math.pow(lat - otherLat, 2) + Math.pow(lng - otherLng, 2));
        return dist < distance;
      });

      // Find the highest scoring restaurant in the cluster to represent it
      const clusterRestaurants = [restaurant, ...nearbyRestaurants];
      const representative = clusterRestaurants.reduce((best, current) => {
        const currentScore = parseFloat(current.veganScore || '0');
        const bestScore = parseFloat(best.veganScore || '0');
        return currentScore > bestScore ? current : best;
      });

      clusters.push({
        representative,
        count: clusterRestaurants.length,
        restaurants: clusterRestaurants
      });

      // Mark all restaurants in this cluster as processed
      clusterRestaurants.forEach(r => processed.add(r.id));
    });

    return clusters;
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log('Map component - rendering restaurants:', restaurants.length);

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Smart clustering algorithm to prevent overlapping
    const clusteredRestaurants = clusterRestaurants(restaurants, 0.002); // ~200m clustering distance
    console.log(`Displaying ${clusteredRestaurants.length} clustered markers from ${restaurants.length} restaurants`);

    clusteredRestaurants.forEach((cluster) => {
      const lat = parseFloat(cluster.representative.latitude);
      const lng = parseFloat(cluster.representative.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const veganScore = cluster.representative.veganScore ? parseFloat(cluster.representative.veganScore) : 0;
      
      const pinColor = veganScore >= 8.5 ? '#16a34a' : 
                      veganScore >= 7.5 ? '#22c55e' :
                      veganScore >= 6.5 ? '#84cc16' :
                      veganScore >= 5.5 ? '#f59e0b' :
                      veganScore >= 4.0 ? '#ef4444' : '#9ca3af';

      // Show cluster count if more than 1 restaurant
      const displayText = cluster.count > 1 ? cluster.count.toString() : veganScore.toFixed(1);
      const markerSize = cluster.count > 1 ? 42 : 36;

      const customIcon = L.divIcon({
        className: 'custom-restaurant-marker',
        html: `
          <div style="
            background-color: ${pinColor};
            color: white;
            border-radius: 50%;
            width: ${markerSize}px;
            height: ${markerSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${cluster.count > 1 ? '14px' : '12px'};
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            ${cluster.count > 1 ? 'border: 3px solid #fbbf24;' : ''}
          ">
            ${displayText}
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize/2, markerSize/2],
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .on('click', (e) => {
          console.log('Map marker clicked:', cluster.representative.name, 'Cluster size:', cluster.count);
          e.originalEvent?.stopPropagation();
          if (cluster.count > 1) {
            // Zoom in to show clustered restaurants
            mapInstanceRef.current?.setView([lat, lng], Math.min(mapInstanceRef.current.getZoom() + 2, 18));
          } else {
            onRestaurantClick(cluster.representative);
          }
        });

      // Add tooltip on hover
      const tooltipText = cluster.count > 1 
        ? `${cluster.count} restaurants in this area` 
        : `${cluster.representative.name} (${veganScore.toFixed(1)})`;
        
      marker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'restaurant-tooltip',
      });

      markersRef.current.push(marker);
    });
  }, [restaurants, onRestaurantClick]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, 15);
    }
  }, [center]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Color Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] text-xs">
        <div className="font-semibold mb-2 text-gray-800">Vegan Score</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#16A34A'}}></div>
            <span>8.5+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#22C55E'}}></div>
            <span>7.5+ Very Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#65A30D'}}></div>
            <span>6.5+ Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#F59E0B'}}></div>
            <span>5.5+ Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#EF4444'}}></div>
            <span>4.0+ Poor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#6B7280'}}></div>
            <span>&lt;4.0 Very Poor</span>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 z-[1000]">
          <div className="w-4 h-4 bg-vegan-green rounded-full animate-pulse"></div>
          <span className="text-sm font-opensans text-neutral-gray">Loading restaurants...</span>
        </div>
      )}
      
      {/* Restaurant count indicator */}
      {restaurants.length > 15 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-1 z-[1000] text-xs text-gray-600">
          Showing top 15 of {restaurants.length} restaurants
        </div>
      )}

      {/* Custom styles for map elements */}
      <style>{`
        .restaurant-tooltip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          color: #374151 !important;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .restaurant-tooltip::before {
          border-top-color: white !important;
        }

        .user-location-marker {
          background: none !important;
          border: none !important;
        }

        .restaurant-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
