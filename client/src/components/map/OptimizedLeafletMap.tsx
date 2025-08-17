import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { API_BASE } from '@/config';
import DebugBar from '../DebugBar';

// Fix Leaflet icon paths
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
});

async function loadBox(bounds: L.LatLngBounds, signal?: AbortSignal) {
  const q = new URLSearchParams({
    minLat: String(bounds.getSouth()),
    minLng: String(bounds.getWest()),
    maxLat: String(bounds.getNorth()),
    maxLng: String(bounds.getEast())
  });
  
  console.log('[MAP] Loading bbox:', bounds.toString());
  const r = await fetch(`${API_BASE}/map-data?${q.toString()}`, { signal });
  if (!r.ok) throw new Error(`map-data ${r.status}`);
  const data = await r.json();
  console.log('[MAP] Received', data.length, 'points from API');
  return data;
}

interface Restaurant {
  id: string;
  name: string;
  latitude: number | string;
  longitude: number | string;
  veganScore: number | string;
  address?: string;
  rating?: number;
}

export default function OptimizedLeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const [pointsCount, setPointsCount] = useState(0);
  const [markers, setMarkers] = useState<Restaurant[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map
    const map = L.map(mapRef.current, {
      center: [42.6977, 23.3219], // Sofia
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Create cluster group
    const clusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        let className = 'marker-cluster-small';
        if (count > 10) className = 'marker-cluster-medium';
        if (count > 100) className = 'marker-cluster-large';
        
        return new (L as any).DivIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: new L.Point(40, 40)
        });
      }
    });

    clusterGroupRef.current = clusterGroup;
    map.addLayer(clusterGroup);

    console.log('[MAP] Map initialized with clustering');

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Reliable bbox fetch on load and moveend
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    let ctrl = new AbortController();
    
    const fetchAndRender = async () => {
      try {
        const bounds = map.getBounds();
        if (!bounds) return;
        
        const items = await loadBox(bounds, ctrl.signal);
        setPointsCount(items.length);
        setMarkers(items);
        
        // Clear existing markers
        if (clusterGroupRef.current) {
          clusterGroupRef.current.clearLayers();
        }
        
        // Add markers to cluster
        items.forEach((restaurant: Restaurant) => {
          const lat = parseFloat(String(restaurant.latitude));
          const lng = parseFloat(String(restaurant.longitude));
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const score = parseFloat(String(restaurant.veganScore || 0));
            let color = '#ff4444'; // red for low scores
            if (score >= 4) color = '#44ff44'; // green for high scores
            else if (score >= 2) color = '#ffaa44'; // orange for medium scores
            
            const marker = L.circleMarker([lat, lng], {
              radius: 8,
              fillColor: color,
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            });
            
            const popupContent = `
              <div>
                <h4>${restaurant.name}</h4>
                <p>Vegan Score: ${score}/8</p>
                ${restaurant.address ? `<p>${restaurant.address}</p>` : ''}
              </div>
            `;
            
            marker.bindPopup(popupContent);
            
            if (clusterGroupRef.current) {
              clusterGroupRef.current.addLayer(marker);
            }
          }
        });
        
        console.log('[MAP] Rendered', items.length, 'markers');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          console.error('[MAP] Fetch error:', e);
        }
      }
    };

    // Event handlers
    const onLoad = () => {
      console.log('[MAP] Load event triggered');
      fetchAndRender();
    };
    
    const onMoveEnd = () => {
      console.log('[MAP] MoveEnd event triggered');
      fetchAndRender();
    };

    map.on('load', onLoad);
    map.on('moveend', onMoveEnd);

    // Initial fetch if map is ready
    if (map.getBounds) {
      console.log('[MAP] Map ready, triggering initial fetch');
      fetchAndRender();
    }

    return () => {
      map.off('load', onLoad);
      map.off('moveend', onMoveEnd);
      ctrl.abort();
    };
  }, [mapInstanceRef]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      <DebugBar count={pointsCount} />
    </div>
  );
}