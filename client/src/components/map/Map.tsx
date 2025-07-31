import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
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
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

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
    
    // Create marker cluster group
    const markerClusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: function(cluster: any) {
        const childCount = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();
        
        // Calculate average vegan score from markers
        let totalScore = 0;
        let validScores = 0;
        
        markers.forEach((marker: any) => {
          if (marker.options && marker.options.veganScore) {
            const score = parseFloat(marker.options.veganScore);
            if (!isNaN(score) && score > 0) {
              totalScore += score;
              validScores++;
            }
          }
        });
        
        const avgScore = validScores > 0 ? (totalScore / validScores).toFixed(1) : '?';
        
        let className = 'marker-cluster marker-cluster-';
        let displayText = childCount.toString();
        
        if (childCount < 5) {
          className += 'small';
        } else if (childCount < 10) {
          className += 'medium';
        } else {
          className += 'large';
        }
        
        // Show average score if available, otherwise show count
        if (avgScore !== '?') {
          displayText = avgScore;
          className += ' with-score';
        }
        
        return new L.DivIcon({
          html: `<div><span>${displayText}</span></div>`,
          className: className,
          iconSize: new L.Point(40, 40)
        });
      }
    });
    
    markerClusterGroupRef.current = markerClusterGroup;
    map.addLayer(markerClusterGroup);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (markerClusterGroupRef.current) {
        markerClusterGroupRef.current = null;
      }
    };
  }, []);

  // Update restaurant markers using markercluster
  const updateRestaurantMarkers = () => {
    if (!mapInstanceRef.current || !markerClusterGroupRef.current || !restaurants.length) return;

    const markerClusterGroup = markerClusterGroupRef.current;
    
    // Clear existing markers
    markerClusterGroup.clearLayers();

    console.log(`Adding ${restaurants.length} restaurants to cluster`);

    restaurants.forEach((restaurant) => {
      const lat = parseFloat(restaurant.latitude);
      const lng = parseFloat(restaurant.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;
      
      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      
      // Create green restaurant marker
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
          " 
          onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 16px rgba(34,197,94,0.4)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'"
          title="${restaurant.name} - Vegan Score: ${veganScore}/10">
            <span style="color: white; font-size: 10px; font-weight: bold;">🍃</span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { 
        icon: restaurantIcon,
        riseOnHover: true,
        veganScore: veganScore.toString() // Store vegan score in marker options
      });

      marker.on('click', (e) => {
        console.log('Map marker clicked:', restaurant.name);
        onRestaurantClick(restaurant, e);
      });

      markerClusterGroup.addLayer(marker);
    });
  };

  // Update markers when restaurants data changes
  useEffect(() => {
    if (restaurants.length > 0) {
      updateRestaurantMarkers();
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