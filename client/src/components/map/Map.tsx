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

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: center,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
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

  // Update restaurants when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !restaurants.length) return;

    const map = mapInstanceRef.current;

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Add restaurant markers
    const bounds = map.getBounds();
    const padding = 0.02;

    const visibleRestaurants = restaurants.filter(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return false;
      
      return lat >= bounds.getSouth() - padding && 
             lat <= bounds.getNorth() + padding &&
             lng >= bounds.getWest() - padding && 
             lng <= bounds.getEast() + padding;
    });

    console.log(`Showing ${visibleRestaurants.length} restaurants`);

    visibleRestaurants.forEach((restaurant) => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      const displayText = veganScore > 0 ? veganScore.toFixed(1) : '?';

      const customIcon = L.divIcon({
        className: 'custom-restaurant-marker',
        html: `
          <div style="
            background-color: #16a34a;
            color: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            ${displayText}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          console.log('Map marker clicked:', restaurant.name);
          const point = map.latLngToContainerPoint([lat, lng]);
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
        });

      marker.bindTooltip(`${restaurant.name} (${displayText})`, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'restaurant-tooltip',
      });

      markersRef.current.push(marker);
    });

    // Add map event listeners for updating markers on move/zoom
    const updateMarkersOnMove = () => {
      // Clear existing restaurant markers
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];

      const bounds = map.getBounds();
      const padding = 0.02;

      const visibleRestaurants = restaurants.filter(restaurant => {
        const lat = parseFloat(restaurant.latitude);
        const lng = parseFloat(restaurant.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return false;
        
        return lat >= bounds.getSouth() - padding && 
               lat <= bounds.getNorth() + padding &&
               lng >= bounds.getWest() - padding && 
               lng <= bounds.getEast() + padding;
      });

      console.log(`Showing ${visibleRestaurants.length} restaurants`);

      visibleRestaurants.forEach((restaurant) => {
        const lat = parseFloat(restaurant.latitude);
        const lng = parseFloat(restaurant.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return;

        const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
        const displayText = veganScore > 0 ? veganScore.toFixed(1) : '?';

        const customIcon = L.divIcon({
          className: 'custom-restaurant-marker',
          html: `
            <div style="
              background-color: #16a34a;
              color: white;
              border-radius: 50%;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${displayText}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            console.log('Map marker clicked:', restaurant.name);
            const point = map.latLngToContainerPoint([lat, lng]);
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
          });

        marker.bindTooltip(`${restaurant.name} (${displayText})`, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
          className: 'restaurant-tooltip',
        });

        markersRef.current.push(marker);
      });
    };

    // Remove old listeners and add new ones
    map.off('moveend zoomend');
    map.on('moveend', updateMarkersOnMove);
    map.on('zoomend', updateMarkersOnMove);

  }, [restaurants, onRestaurantClick]);

  return (
    <div ref={mapRef} className="w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      )}
    </div>
  );
}