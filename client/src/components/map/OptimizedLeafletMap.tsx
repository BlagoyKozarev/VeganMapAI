import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { API_BASE } from '@/config';
import DebugBar from '../DebugBar';
import { normalizeItem, type MapPoint } from '@/utils/normalize';

// Icons are fixed in main.tsx

async function loadBox(bounds: L.LatLngBounds, signal?: AbortSignal): Promise<MapPoint[]> {
  const q = new URLSearchParams({
    minLat: String(bounds.getSouth()),
    minLng: String(bounds.getWest()),
    maxLat: String(bounds.getNorth()),
    maxLng: String(bounds.getEast())
  });
  
  console.log('[MAP] Loading bbox:', bounds.toString());
  const r = await fetch(`${API_BASE}/map-data?${q.toString()}`, { signal });
  if (!r.ok) throw new Error(`map-data ${r.status}`);
  const raw = await r.json();
  const items = (Array.isArray(raw) ? raw : []).map(normalizeItem).filter(Boolean) as MapPoint[];
  console.log('[MAP] Received', raw.length, 'raw items, normalized to', items.length, 'points');
  return items;
}

export default function OptimizedLeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const [pointsCount, setPointsCount] = useState(0);
  const [points, setPoints] = useState<MapPoint[]>([]);

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
        setPoints(items);
        
        // Clear existing markers
        if (clusterGroupRef.current) {
          clusterGroupRef.current.clearLayers();
        }
        
        // Add markers to cluster
        items.forEach((point: MapPoint) => {
          const score = point.score || 0;
          let color = '#ff4444'; // red for low scores
          if (score >= 4) color = '#44ff44'; // green for high scores
          else if (score >= 2) color = '#ffaa44'; // orange for medium scores
          
          const marker = L.marker([point.lat, point.lng], {
            title: point.name
          });
          
          const popupContent = `
            <div>
              <h4>${point.name}</h4>
              <p>Vegan Score: ${score}/8</p>
              ${point.address ? `<p>${point.address}</p>` : ''}
            </div>
          `;
          
          marker.bindPopup(popupContent);
          
          if (clusterGroupRef.current) {
            clusterGroupRef.current.addLayer(marker);
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
      <DebugBar count={points.length} />
    </div>
  );
}