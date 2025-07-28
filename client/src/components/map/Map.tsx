import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '@shared/schema';
import MapControls from './MapControls';

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
  
  // Map controls state
  const [viewMode, setViewMode] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [radius, setRadius] = useState(2);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);

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

  // Filter restaurants based on controls
  useEffect(() => {
    const filtered = restaurants.filter(restaurant => {
      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      
      // Filter by minimum vegan score
      if (veganScore < minScore) return false;
      
      // Filter by radius (distance from map center)
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return false;
      
      const distance = calculateDistance(center[0], center[1], lat, lng);
      if (distance > radius) return false;
      
      return true;
    });
    
    setFilteredRestaurants(filtered);
  }, [restaurants, minScore, radius, center]);

  // Calculate distance between two points in km
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Change map tile layer based on view mode
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add new tile layer based on view mode
    let tileLayer;
    switch (viewMode) {
      case 'satellite':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Esri',
          maxZoom: 19,
        });
        break;
      case 'terrain':
        tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenTopoMap',
          maxZoom: 17,
        });
        break;
      default:
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '',
          maxZoom: 19,
        });
    }
    
    tileLayer.addTo(map);
  }, [viewMode]);

  // No clustering - show all filtered restaurants individually
  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    console.log('Map component - rendering restaurants:', filteredRestaurants.length);

    // Clear existing restaurant markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Filter restaurants visible in current map bounds with some buffer
    const map = mapInstanceRef.current;
    const bounds = map.getBounds();
    const padding = 0.05; // Add padding to show restaurants just outside visible area
    
    const visibleRestaurants = filteredRestaurants.filter(restaurant => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return false;
      
      return lat >= bounds.getSouth() - padding && 
             lat <= bounds.getNorth() + padding &&
             lng >= bounds.getWest() - padding && 
             lng <= bounds.getEast() + padding;
    });

    console.log(`Showing ${visibleRestaurants.length} restaurants without clustering`);

    // Show all restaurants individually with green pins
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
        .addTo(mapInstanceRef.current!)
        .on('click', () => {
          console.log('Map marker clicked:', restaurant.name);
          onRestaurantClick(restaurant);
        });

      // Add tooltip on hover
      const tooltipText = `${restaurant.name} (${displayText})`;
        
      marker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'restaurant-tooltip',
      });

      markersRef.current.push(marker);
    });
  };

  // Update markers when map moves or zooms
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const handleMapChange = () => {
      updateMarkers();
    };
    
    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange);
    
    return () => {
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
    };
  }, [filteredRestaurants]);

  useEffect(() => {
    updateMarkers();
  }, [filteredRestaurants]);

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
      
      {/* Map Controls */}
      <MapControls
        onViewModeChange={setViewMode}
        onShowTrafficChange={setShowTraffic}
        onShowTransitChange={setShowTransit}
        onScoreFilterChange={setMinScore}
        onRadiusChange={setRadius}
        currentViewMode={viewMode}
        showTraffic={showTraffic}
        showTransit={showTransit}
        minScore={minScore}
        radius={radius}
      />

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