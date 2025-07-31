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
      boxZoom: false, // Disable on mobile for better touch
      keyboard: false, // Disable on mobile
      dragging: true,
      maxBounds: undefined,
      maxBoundsViscosity: 0.0,
      // Mobile-specific settings
      renderer: L.canvas({ tolerance: 15 }) // Better touch tolerance
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
  }, []); // Only run once

  // Intelligent clustering function
  const clusterRestaurants = (restaurants: Restaurant[], zoom: number) => {
    // Determine clustering distance based on zoom level
    let clusterDistance: number;
    if (zoom >= 17) clusterDistance = 0.0001; // ~10m at zoom 17+
    else if (zoom >= 15) clusterDistance = 0.0003; // ~30m at zoom 15-16
    else if (zoom >= 13) clusterDistance = 0.001;  // ~100m at zoom 13-14
    else clusterDistance = 0.003; // ~300m at zoom <13

    const clusters: Array<{
      center: [number, number];
      restaurants: Restaurant[];
      avgScore: number;
    }> = [];

    restaurants.forEach(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      // Find existing cluster within distance
      let nearestCluster = clusters.find(cluster => {
        const distance = Math.sqrt(
          Math.pow(cluster.center[0] - lat, 2) + 
          Math.pow(cluster.center[1] - lng, 2)
        );
        return distance <= clusterDistance;
      });

      if (nearestCluster) {
        // Add to existing cluster
        nearestCluster.restaurants.push(restaurant);
        
        // Recalculate cluster center (average position)
        const totalLat = nearestCluster.restaurants.reduce((sum, r) => sum + parseFloat(r.latitude), 0);
        const totalLng = nearestCluster.restaurants.reduce((sum, r) => sum + parseFloat(r.longitude), 0);
        nearestCluster.center = [
          totalLat / nearestCluster.restaurants.length,
          totalLng / nearestCluster.restaurants.length
        ];
        
        // Recalculate average score
        const validScores = nearestCluster.restaurants
          .map(r => r.veganScore ? parseFloat(r.veganScore) : 0)
          .filter(score => score > 0);
        nearestCluster.avgScore = validScores.length > 0 
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : 0;
      } else {
        // Create new cluster
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
      const isCluster = cluster.restaurants.length > 1;
      const displayText = isCluster 
        ? cluster.restaurants.length.toString()
        : (cluster.avgScore > 0 ? cluster.avgScore.toFixed(1) : '?');

      // Enhanced Google Maps style cluster design
      const clusterSize = Math.min(60, Math.max(40, 30 + cluster.restaurants.length * 2));
      const backgroundColor = isCluster 
        ? (cluster.restaurants.length >= 10 ? '#1565C0' : cluster.restaurants.length >= 5 ? '#FB8C00' : '#E53935')
        : '#0F9D58';

      const customIcon = L.divIcon({
        className: `custom-restaurant-marker ${isCluster ? 'cluster-marker' : 'single-marker'}`,
        html: `
          <div class="marker-container" style="
            position: relative;
            width: ${isCluster ? clusterSize : 38}px;
            height: ${isCluster ? clusterSize : 38}px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <div class="marker-inner" style="
              background: ${backgroundColor};
              color: white;
              border-radius: 50%;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: ${isCluster ? Math.min(16, 12 + cluster.restaurants.length) : 11}px;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15);
              cursor: pointer;
              font-family: 'Roboto', -apple-system, sans-serif;
              letter-spacing: -0.5px;
              ${isCluster ? 'transform: scale(1); animation: cluster-pulse 3s ease-in-out infinite;' : ''}
            ">
              ${displayText}
            </div>
            ${isCluster ? `
              <div class="cluster-ring" style="
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border: 2px solid ${backgroundColor}40;
                border-radius: 50%;
                animation: cluster-expand 2s ease-in-out infinite;
              "></div>
            ` : ''}
          </div>
          <style>
            @keyframes cluster-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes cluster-expand {
              0%, 100% { 
                transform: scale(1); 
                opacity: 0.6; 
              }
              50% { 
                transform: scale(1.2); 
                opacity: 0.3; 
              }
            }
            .marker-container:hover .marker-inner {
              transform: scale(1.1);
              box-shadow: 0 6px 16px rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.2);
            }
          </style>
        `,
        iconSize: isCluster ? [clusterSize, clusterSize] : [38, 38],
        iconAnchor: isCluster ? [clusterSize/2, clusterSize/2] : [19, 19],
      });

      const marker = L.marker(cluster.center, { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          if (isCluster && cluster.restaurants.length > 1) {
            // Zoom into cluster
            const clusterBounds = L.latLngBounds(
              cluster.restaurants.map(r => [parseFloat(r.latitude), parseFloat(r.longitude)])
            );
            map.fitBounds(clusterBounds, { padding: [20, 20] });
          } else {
            // Show restaurant details
            const restaurant = cluster.restaurants[0];
            console.log('Map marker clicked:', restaurant.name);
            const point = map.latLngToContainerPoint(cluster.center);
            const mapContainer = map.getContainer();
            const mapRect = mapContainer.getBoundingClientRect();
            
            const screenX = mapRect.left + point.x;
            const screenY = mapRect.top + point.y;
            
            const mockEvent = {
              target: {
                getBoundingClientRect: () => ({
                  left: screenX - 18,
                  top: screenY - 18,
                  width: 36,
                  height: 36,
                  right: screenX + 18,
                  bottom: screenY + 18
                })
              }
            };
            
            onRestaurantClick(restaurant, mockEvent);
          }
        });

      // Enhanced Google Maps style tooltips
      const tooltipText = isCluster 
        ? `<div style="text-align: center; padding: 2px;">
             <div style="font-weight: 600; color: #333;">${cluster.restaurants.length} ресторанта</div>
             <div style="font-size: 12px; color: #666; margin-top: 2px;">
               Средна оценка: ${cluster.avgScore > 0 ? cluster.avgScore.toFixed(1) : 'N/A'}/10
             </div>
             <div style="font-size: 11px; color: #888; margin-top: 1px;">Кликнете за увеличаване</div>
           </div>`
        : `<div style="text-align: center; padding: 2px;">
             <div style="font-weight: 600; color: #333; max-width: 200px;">${cluster.restaurants[0].name}</div>
             <div style="font-size: 12px; color: #666; margin-top: 2px;">
               Vegan Score: ${displayText}/10
             </div>
           </div>`;

      marker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top',
        offset: [0, isCluster ? -Math.ceil(clusterSize/2) - 5 : -24],
        className: 'google-maps-tooltip',
        opacity: 0.95
      });

      markersRef.current.push(marker);
    });
  };

  // Initial load of restaurants
  useEffect(() => {
    updateRestaurantMarkers();
  }, [restaurants]);

  // Update markers on map move/zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    const handleMapUpdate = () => {
      updateRestaurantMarkers();
    };

    map.on('moveend', handleMapUpdate);
    map.on('zoomend', handleMapUpdate);

    return () => {
      map.off('moveend', handleMapUpdate);
      map.off('zoomend', handleMapUpdate);
    };
  }, [restaurants]);

  return (
    <div ref={mapRef} className="w-full h-full relative z-0 touch-manipulation" style={{ minHeight: '400px', maxHeight: '100vh' }}>

      
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      )}
    </div>
  );
}