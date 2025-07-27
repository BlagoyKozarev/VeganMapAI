import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RestaurantPin from './RestaurantPin';
import { Restaurant } from '@/types';

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

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log('Map component - rendering restaurants:', restaurants.length);

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Smart filtering to avoid overcrowding
    let displayRestaurants = [...restaurants];
    
    // Sort by vegan score (highest first)
    displayRestaurants.sort((a, b) => {
      const scoreA = a.veganScore ? parseFloat(a.veganScore) : 0;
      const scoreB = b.veganScore ? parseFloat(b.veganScore) : 0;
      return scoreB - scoreA;
    });

    // Limit display based on zoom level and density
    const maxRestaurants = 15; // Maximum restaurants to show at once
    if (displayRestaurants.length > maxRestaurants) {
      console.log(`Reducing ${displayRestaurants.length} restaurants to ${maxRestaurants} highest-scoring ones`);
      displayRestaurants = displayRestaurants.slice(0, maxRestaurants);
    }

    // Add restaurant markers
    displayRestaurants.forEach(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      
      // Determine pin color based on vegan score
      let pinColor = '#6B7280'; // gray for no score
      if (veganScore >= 8.5) {
        pinColor = '#16A34A'; // dark green for excellent (8.5+)
      } else if (veganScore >= 7.5) {
        pinColor = '#22C55E'; // green for very good (7.5-8.4)
      } else if (veganScore >= 6.5) {
        pinColor = '#65A30D'; // yellow-green for good (6.5-7.4)
      } else if (veganScore >= 5.5) {
        pinColor = '#F59E0B'; // orange for fair (5.5-6.4)
      } else if (veganScore >= 4.0) {
        pinColor = '#EF4444'; // red for poor (4.0-5.4)
      } else {
        pinColor = '#6B7280'; // gray for very poor or no score
      }

      const restaurantIcon = L.divIcon({
        className: 'restaurant-marker',
        html: `
          <div class="score-badge bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm cursor-pointer hover:scale-110 transition-transform shadow-lg border-2" 
               style="background-color: ${pinColor}; color: white; border-color: white;">
            ${veganScore ? veganScore.toFixed(1) : '?'}
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const marker = L.marker([lat, lng], { icon: restaurantIcon })
        .addTo(mapInstanceRef.current!)
        .on('click', (e) => {
          console.log('Map marker clicked:', restaurant.name);
          e.originalEvent?.stopPropagation();
          onRestaurantClick(restaurant);
        });

      // Add tooltip on hover
      marker.bindTooltip(`${restaurant.name} (${veganScore.toFixed(1)})`, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'restaurant-tooltip',
      });

      markersRef.current.push(marker);
    });

    console.log(`Displayed ${displayRestaurants.length} out of ${restaurants.length} restaurants`);
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
