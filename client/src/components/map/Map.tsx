import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  onLocationChange?: (center: [number, number]) => void;
  loading?: boolean;
}

export default function Map({ center, restaurants, onRestaurantClick, onLocationChange, loading }: MapProps) {
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
    const clusters: { representative: Restaurant; count: number; restaurants: Restaurant[]; centerLat?: number; centerLng?: number }[] = [];
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

      // Calculate cluster center position for better visual distribution
      const centerLat = clusterRestaurants.reduce((sum, r) => sum + parseFloat(r.latitude), 0) / clusterRestaurants.length;
      const centerLng = clusterRestaurants.reduce((sum, r) => sum + parseFloat(r.longitude), 0) / clusterRestaurants.length;
      
      // Add slight offset for single restaurants to prevent exact overlap
      let finalLat = centerLat;
      let finalLng = centerLng;
      
      if (clusterRestaurants.length === 1) {
        // Small random offset for individual restaurants to prevent stacking
        const offsetLat = (Math.random() - 0.5) * 0.00005; // ~5m offset
        const offsetLng = (Math.random() - 0.5) * 0.00005;
        finalLat = centerLat + offsetLat;
        finalLng = centerLng + offsetLng;
      }

      clusters.push({
        representative,
        count: clusterRestaurants.length,
        restaurants: clusterRestaurants,
        centerLat: finalLat,
        centerLng: finalLng
      });

      // Mark all restaurants in this cluster as processed
      clusterRestaurants.forEach(r => processed.add(r.id));
    });

    return clusters;
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    console.log('Map component - rendering restaurants:', restaurants.length);

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Filter restaurants visible in current map bounds with some buffer
    const map = mapInstanceRef.current;
    const bounds = map.getBounds();
    const padding = 0.05; // Add padding to show restaurants just outside visible area
    
    const visibleRestaurants = restaurants.filter(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return false;
      
      return lat >= bounds.getSouth() - padding && 
             lat <= bounds.getNorth() + padding &&
             lng >= bounds.getWest() - padding && 
             lng <= bounds.getEast() + padding;
    });

    console.log(`Showing ${visibleRestaurants.length} restaurants in current map bounds`);

    // Dynamic clustering based on zoom level
    const zoom = map.getZoom();
    
    // Balanced clustering - prevent overlapping while showing individual restaurants
    const clusterDistance = zoom >= 17 ? 0.0001 :  // ~10m at very high zoom
                           zoom >= 15 ? 0.0003 :    // ~30m at high zoom 
                           zoom >= 13 ? 0.0006 :    // ~60m at medium zoom
                           0.0012;                  // ~120m at low zoom
    
    const clusteredRestaurants = clusterRestaurants(visibleRestaurants, clusterDistance);
    console.log(`Zoom: ${zoom.toFixed(1)}, Distance: ${clusterDistance.toFixed(4)}, Displaying ${clusteredRestaurants.length} clustered markers from ${visibleRestaurants.length} visible restaurants`);

    clusteredRestaurants.forEach((cluster) => {
      // Use cluster center for better positioning, fallback to representative
      const lat = cluster.centerLat || parseFloat(cluster.representative.latitude);
      const lng = cluster.centerLng || parseFloat(cluster.representative.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const veganScore = cluster.representative.veganScore ? parseFloat(cluster.representative.veganScore) : 0;
      
      const pinColor = veganScore >= 8.5 ? '#16a34a' : 
                      veganScore >= 7.5 ? '#22c55e' :
                      veganScore >= 6.5 ? '#84cc16' :
                      veganScore >= 5.5 ? '#f59e0b' :
                      veganScore >= 4.0 ? '#ef4444' : '#9ca3af';

      // Show cluster count if more than 1 restaurant, otherwise show score
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
        .on('click', () => {
          console.log('Map marker clicked:', cluster.representative.name, 'Cluster size:', cluster.count);
          if (cluster.count > 1) {
            // Zoom in more aggressively to break clusters
            const newZoom = Math.min(zoom + 4, 19);
            map.setView([lat, lng], newZoom);
            console.log(`Zooming to level ${newZoom} to break cluster of ${cluster.count} restaurants`);
          } else {
            // Single restaurant click
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
  };

  // Update markers when zoom changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const handleZoomEnd = () => {
      updateMarkers();
    };
    
    map.on('zoomend', handleZoomEnd);
    
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [restaurants]);

  useEffect(() => {
    updateMarkers();
  }, [restaurants]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, 15);
    }
  }, [center]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 z-[1000]">
          <div className="w-4 h-4 bg-vegan-green rounded-full animate-pulse"></div>
          <span className="text-sm font-opensans text-neutral-gray">Loading restaurants...</span>
        </div>
      )}
      
      {/* Location controls */}
      <div className="absolute bottom-4 right-4 z-[1000] space-y-2">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
                mapInstanceRef.current?.setView(newCenter, 15);
                onLocationChange?.(newCenter);
              });
            }
          }}
          className="block w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="My Location"
        >
          <span className="text-blue-500 text-lg">📍</span>
        </button>
        
        <button
          onClick={() => {
            // Sofia center - много ресторанти
            const sofiaCenter: [number, number] = [42.6977, 23.3219];
            mapInstanceRef.current?.setView(sofiaCenter, 15);
            console.log('Switching to Sofia center:', sofiaCenter);
            // Reload page with new location
            window.location.href = `/?lat=${sofiaCenter[0]}&lng=${sofiaCenter[1]}`;
          }}
          className="block w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Sofia Center"
        >
          <span className="text-green-500 text-lg">🏛️</span>
        </button>
        
        <button
          onClick={() => {
            // Vitosha Boulevard area - различни ресторанти  
            const vitoshaArea: [number, number] = [42.6837, 23.3207];
            mapInstanceRef.current?.setView(vitoshaArea, 15);
            console.log('Switching to Vitosha area:', vitoshaArea);
            // Reload page with new location
            window.location.href = `/?lat=${vitoshaArea[0]}&lng=${vitoshaArea[1]}`;
          }}
          className="block w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Vitosha Boulevard"
        >
          <span className="text-purple-500 text-lg">🛍️</span>
        </button>
      </div>
      
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
          padding: 4px 8px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        .restaurant-tooltip::before {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  );
}