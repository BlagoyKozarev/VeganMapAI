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
  onRestaurantClick: (restaurant: Restaurant, event?: any) => void;
  onLocationChange?: (center: [number, number]) => void;
  loading?: boolean;
}

export default function Map({ center, restaurants, onRestaurantClick, loading }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map once with better mobile support
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('Initializing map with center:', center);
    
    const map = L.map(mapRef.current, {
      center: center,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
      // Enhanced mobile optimizations
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: 'center',
      boxZoom: false,
      keyboard: false,
      dragging: true,
      maxBounds: undefined,
      maxBoundsViscosity: 0.0,
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
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Intelligent clustering function
  const clusterRestaurants = (restaurants: Restaurant[], zoom: number) => {
    let clusterDistance: number;
    if (zoom >= 17) clusterDistance = 0.0001;
    else if (zoom >= 15) clusterDistance = 0.0003;
    else if (zoom >= 13) clusterDistance = 0.001;
    else clusterDistance = 0.003;

    const clusters: Array<{
      center: [number, number];
      restaurants: Restaurant[];
      avgScore: number;
    }> = [];

    restaurants.forEach(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      let nearestCluster = clusters.find(cluster => {
        const distance = Math.sqrt(
          Math.pow(cluster.center[0] - lat, 2) + 
          Math.pow(cluster.center[1] - lng, 2)
        );
        return distance <= clusterDistance;
      });

      if (nearestCluster) {
        nearestCluster.restaurants.push(restaurant);
        
        const totalLat = nearestCluster.restaurants.reduce((sum, r) => sum + parseFloat(r.latitude), 0);
        const totalLng = nearestCluster.restaurants.reduce((sum, r) => sum + parseFloat(r.longitude), 0);
        nearestCluster.center = [
          totalLat / nearestCluster.restaurants.length,
          totalLng / nearestCluster.restaurants.length
        ];
        
        const validScores = nearestCluster.restaurants
          .map(r => r.veganScore ? parseFloat(r.veganScore) : 0)
          .filter(score => score > 0);
        nearestCluster.avgScore = validScores.length > 0 
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : 0;
      } else {
        const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
        clusters.push({
          center: [lat, lng],
          restaurants: [restaurant],
          avgScore: veganScore
        });
      }
    });

    return clusters;
  };

  // Update restaurants when data changes or map moves/zooms
  const updateRestaurantMarkers = () => {
    if (!mapInstanceRef.current || !restaurants.length) return;

    const map = mapInstanceRef.current;
    const zoom = map.getZoom();

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Filter visible restaurants based on viewport
    const bounds = map.getBounds();
    const padding = 0.01;

    const visibleRestaurants = restaurants.filter(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return false;
      
      return lat >= bounds.getSouth() - padding && 
             lat <= bounds.getNorth() + padding &&
             lng >= bounds.getWest() - padding && 
             lng <= bounds.getEast() + padding;
    });

    // Apply intelligent clustering
    const clusters = clusterRestaurants(visibleRestaurants, zoom);
    
    console.log(`Zoom: ${zoom}, Showing ${clusters.length} clusters from ${visibleRestaurants.length} restaurants`);

    clusters.forEach((cluster) => {
      if (cluster.restaurants.length === 1) {
        // Single restaurant - green pin
        const restaurant = cluster.restaurants[0];
        const lat = parseFloat(restaurant.latitude);
        const lng = parseFloat(restaurant.longitude);
        
        const offsetLat = lat + (Math.random() - 0.5) * 0.0001;
        const offsetLng = lng + (Math.random() - 0.5) * 0.0001;
        
        const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
        
        const restaurantIcon = L.divIcon({
          className: 'restaurant-marker-single',
          html: `
            <div class="restaurant-pin" style="
              width: 24px; 
              height: 24px; 
              background: #22c55e; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
              animation: float 3s ease-in-out infinite;
              cursor: pointer;
              transition: all 0.2s ease;
            " 
            onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 16px rgba(34,197,94,0.4)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'"
            title="${restaurant.name} - Vegan Score: ${veganScore}/10">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 8px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
              ">🍃</div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([offsetLat, offsetLng], { 
          icon: restaurantIcon,
          riseOnHover: true,
          zIndexOffset: 1000
        }).addTo(map);

        marker.on('click', (e) => {
          console.log('Map marker clicked:', restaurant.name);
          onRestaurantClick(restaurant, e);
        });

        markersRef.current.push(marker);
      } else {
        // Cluster marker with Google Maps styling
        const count = cluster.restaurants.length;
        const avgScore = cluster.avgScore;
        
        // Determine cluster color based on count (Google Maps style)
        let clusterColor, textColor, ringColor;
        if (count >= 10) {
          clusterColor = '#1e40af'; // Blue
          textColor = 'white';
          ringColor = 'rgba(30, 64, 175, 0.3)';
        } else if (count >= 5) {
          clusterColor = '#ea580c'; // Orange  
          textColor = 'white';
          ringColor = 'rgba(234, 88, 12, 0.3)';
        } else {
          clusterColor = '#dc2626'; // Red
          textColor = 'white'; 
          ringColor = 'rgba(220, 38, 38, 0.3)';
        }
        
        // Dynamic sizing based on count
        const baseSize = Math.min(45, Math.max(30, 25 + count * 1.5));
        const fontSize = Math.min(16, Math.max(11, 8 + count * 0.3));
        
        const clusterIcon = L.divIcon({
          className: 'restaurant-cluster-marker',
          html: `
            <div class="cluster-container" style="
              position: relative;
              width: ${baseSize}px;
              height: ${baseSize}px;
              cursor: pointer;
            ">
              <!-- Pulsing ring animation -->
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${baseSize + 20}px;
                height: ${baseSize + 20}px;
                background: ${ringColor};
                border-radius: 50%;
                animation: pulse-ring 2s ease-out infinite;
                z-index: 1;
              "></div>
              
              <!-- Main cluster circle -->
              <div style="
                position: relative;
                width: 100%;
                height: 100%;
                background: ${clusterColor};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 3px 12px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 600;
                color: ${textColor};
                font-size: ${fontSize}px;
                z-index: 10;
                transition: all 0.2s ease;
                animation: float 4s ease-in-out infinite;
              "
              onmouseover="
                this.style.transform='scale(1.15)'; 
                this.style.boxShadow='0 4px 20px rgba(0,0,0,0.35)';
                this.style.zIndex='1000';
              "
              onmouseout="
                this.style.transform='scale(1)'; 
                this.style.boxShadow='0 3px 12px rgba(0,0,0,0.25)';
                this.style.zIndex='10';
              "
              title="📍 ${count} restaurants • Avg Vegan Score: ${avgScore.toFixed(1)}/10"
              >
                ${count}
              </div>
            </div>
          `,
          iconSize: [baseSize, baseSize],
          iconAnchor: [baseSize/2, baseSize/2],
        });

        const clusterMarker = L.marker(cluster.center, { 
          icon: clusterIcon,
          riseOnHover: true,
          zIndexOffset: 500
        }).addTo(map);

        // Show cluster details on click
        clusterMarker.on('click', () => {
          const popup = L.popup({
            maxWidth: 300,
            className: 'cluster-popup'
          })
          .setLatLng(cluster.center)
          .setContent(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                📍 ${count} Restaurants
              </h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
                Average Vegan Score: <strong>${avgScore.toFixed(1)}/10</strong>
              </p>
              <div style="max-height: 150px; overflow-y: auto; font-size: 13px; line-height: 1.4;">
                ${cluster.restaurants.map(r => `
                  <div style="padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong>${r.name}</strong><br>
                    <span style="color: #6b7280;">Vegan Score: ${r.veganScore || 0}/10</span>
                  </div>
                `).join('')}
              </div>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #9ca3af;">
                Zoom in to see individual restaurants
              </p>
            </div>
          `)
          .openOn(map);
        });

        markersRef.current.push(clusterMarker);
      }
    });
  };

  // Call update function when restaurants change
  useEffect(() => {
    if (mapInstanceRef.current && restaurants.length > 0) {
      updateRestaurantMarkers();
      
      // Add map event listeners
      const map = mapInstanceRef.current;
      map.on('zoomend moveend', updateRestaurantMarkers);
      
      return () => {
        map.off('zoomend moveend', updateRestaurantMarkers);
      };
    }
  }, [restaurants]);

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