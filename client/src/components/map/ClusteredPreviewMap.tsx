import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import MarkerCluster
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix Leaflet icon paths
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
});

export default function ClusteredPreviewMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  console.log('[CLUSTERED MAP] Component loading, restaurants:', restaurants.length);

  // Fetch fresh data
  useEffect(() => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    console.log('[CLUSTERED MAP] Fetching with unique ID:', uniqueId);
    
    fetch(`/api/v1/map-data?fresh=${uniqueId}&t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(res => {
      console.log('[CLUSTERED MAP] Response:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('[CLUSTERED MAP] Raw data received:', data);
      if (data.restaurants && Array.isArray(data.restaurants)) {
        console.log('[CLUSTERED MAP] Setting', data.restaurants.length, 'restaurants');
        setRestaurants(data.restaurants);
        setIsReady(true);
      }
    })
    .catch(err => {
      console.error('[CLUSTERED MAP] Error:', err);
      setIsReady(true);
    });
  }, []);

  // Create map with clustering
  useEffect(() => {
    if (!mapRef.current || !isReady) return;
    if (restaurants.length === 0) {
      console.log('[CLUSTERED MAP] No restaurants to display');
      return;
    }

    console.log('[CLUSTERED MAP] Creating map with', restaurants.length, 'restaurants');

    // Clean up
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    // Create new map
    const map = L.map(mapRef.current).setView([42.6977, 23.3219], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create cluster group
    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        let color = '#22c55e'; // green
        let size = 40;
        
        if (count > 50) {
          color = '#ef4444'; // red
          size = 60;
        } else if (count > 20) {
          color = '#f97316'; // orange
          size = 50;
        }

        return L.divIcon({
          html: `<div style="
            background: ${color};
            color: white;
            border-radius: 50%;
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${size > 50 ? '18px' : '14px'};
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">${count}</div>`,
          className: 'custom-cluster',
          iconSize: [size, size]
        });
      },
      maxClusterRadius: 80,
      disableClusteringAtZoom: 15
    });

    // Add markers
    let added = 0;
    restaurants.forEach((restaurant) => {
      if (restaurant.latitude && restaurant.longitude) {
        const lat = parseFloat(restaurant.latitude);
        const lng = parseFloat(restaurant.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const score = restaurant.veganScore || 0;
          let color = '#22c55e';
          
          if (score >= 8) color = '#16a34a';
          else if (score >= 6) color = '#22c55e';
          else if (score >= 4) color = '#eab308';
          else color = '#ef4444';

          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              html: `<div style="
                width: 12px;
                height: 12px;
                background: ${color};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>`,
              className: 'restaurant-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })
          });

          marker.bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px;">${restaurant.name}</h3>
              <p style="margin: 4px 0; font-size: 14px;">Vegan Score: ${score}/10</p>
              ${restaurant.address ? `<p style="margin: 4px 0; font-size: 12px;">${restaurant.address}</p>` : ''}
            </div>
          `);

          clusterGroup.addLayer(marker);
          added++;
        }
      }
    });

    console.log('[CLUSTERED MAP] Added', added, 'markers to cluster');
    map.addLayer(clusterGroup);

    // Fit bounds if we have markers
    if (added > 0) {
      setTimeout(() => {
        try {
          const group = (L as any).featureGroup(clusterGroup.getLayers());
          map.fitBounds(group.getBounds(), { padding: [10, 10] });
        } catch (e) {
          console.warn('[CLUSTERED MAP] Could not fit bounds');
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [restaurants, isReady]);

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      {restaurants.length > 0 && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow-md text-sm font-medium">
          {restaurants.length} Restaurants with Clustering
        </div>
      )}
      {restaurants.length === 0 && isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">No restaurant data available</p>
        </div>
      )}
    </div>
  );
}