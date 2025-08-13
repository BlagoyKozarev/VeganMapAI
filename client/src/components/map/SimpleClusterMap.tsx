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

interface Restaurant {
  id: string;
  name: string;
  latitude: number | string;
  longitude: number | string;
  veganScore: number | string;
  address?: string;
  rating?: number;
}

interface SimpleClusterMapProps {
  restaurants: Restaurant[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function SimpleClusterMap({ 
  restaurants, 
  center = [42.6977, 23.3219], 
  zoom = 12, 
  className = "" 
}: SimpleClusterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  console.log('[SIMPLE CLUSTER MAP] Component loading with', restaurants.length, 'restaurants');

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
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    console.log('[SIMPLE CLUSTER MAP] Map initialized');
    setIsReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Add restaurants with clustering
  useEffect(() => {
    if (!mapInstanceRef.current || !isReady || restaurants.length === 0) {
      console.log('[SIMPLE CLUSTER MAP] Not ready or no restaurants:', {
        mapReady: !!mapInstanceRef.current,
        isReady,
        restaurantCount: restaurants.length
      });
      return;
    }

    console.log('[SIMPLE CLUSTER MAP] Adding restaurants to map...');

    // Clean up existing cluster group
    if (clusterGroupRef.current) {
      mapInstanceRef.current.removeLayer(clusterGroupRef.current);
    }

    // Check if MarkerCluster is available
    const hasMarkerCluster = typeof (L as any).markerClusterGroup === 'function';
    console.log('[SIMPLE CLUSTER MAP] MarkerCluster available:', hasMarkerCluster);

    let clusterGroup: any;
    
    if (hasMarkerCluster) {
      // Create cluster group with custom styling
      clusterGroup = (L as any).markerClusterGroup({
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let color = '#22c55e'; // green for small clusters
          let size = 40;
          
          if (count > 50) {
            color = '#ef4444'; // red for large clusters
            size = 60;
          } else if (count > 20) {
            color = '#f97316'; // orange for medium clusters  
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
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              border: 3px solid white;
              cursor: pointer;
            ">${count}</div>`,
            className: 'cluster-icon',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          });
        },
        maxClusterRadius: 60,
        disableClusteringAtZoom: 16,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });
      
      console.log('[SIMPLE CLUSTER MAP] Created MarkerClusterGroup');
    } else {
      clusterGroup = L.layerGroup();
      console.warn('[SIMPLE CLUSTER MAP] Using fallback LayerGroup');
    }

    // Add markers
    let markersAdded = 0;
    restaurants.forEach((restaurant, index) => {
      const lat = parseFloat(String(restaurant.latitude));
      const lng = parseFloat(String(restaurant.longitude));
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('[SIMPLE CLUSTER MAP] Invalid coordinates for restaurant:', restaurant.name, { lat, lng });
        return;
      }

      try {
        // Create marker with custom icon based on vegan score
        const score = parseFloat(String(restaurant.veganScore)) || 0;
        let color = '#22c55e'; // green default
        
        if (score >= 8) color = '#16a34a'; // dark green
        else if (score >= 6) color = '#22c55e'; // green
        else if (score >= 4) color = '#eab308'; // yellow
        else color = '#ef4444'; // red

        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div style="
              width: 14px;
              height: 14px;
              background: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            className: 'restaurant-marker',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          })
        });

        // Add popup
        marker.bindPopup(`
          <div style="min-width: 200px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
              ${restaurant.name}
            </h3>
            <p style="margin: 4px 0; font-size: 14px;">
              <strong>Vegan Score:</strong> ${score}/10
            </p>
            ${restaurant.address ? `
              <p style="margin: 4px 0; font-size: 12px; color: #666;">
                📍 ${restaurant.address}
              </p>
            ` : ''}
            ${restaurant.rating ? `
              <p style="margin: 4px 0; font-size: 12px; color: #666;">
                ⭐ Rating: ${restaurant.rating}/5
              </p>
            ` : ''}
          </div>
        `);

        clusterGroup.addLayer(marker);
        markersAdded++;
      } catch (error) {
        console.error('[SIMPLE CLUSTER MAP] Error creating marker for:', restaurant.name, error);
      }
    });

    console.log('[SIMPLE CLUSTER MAP] Added', markersAdded, 'markers to cluster group');

    // Add cluster group to map
    clusterGroupRef.current = clusterGroup;
    mapInstanceRef.current.addLayer(clusterGroup);

    // Fit map bounds to show all markers
    if (markersAdded > 0) {
      try {
        const group = (L as any).featureGroup(clusterGroup.getLayers ? clusterGroup.getLayers() : []);
        if (group.getLayers().length > 0) {
          mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
        console.log('[SIMPLE CLUSTER MAP] Fitted map bounds');
      } catch (error) {
        console.warn('[SIMPLE CLUSTER MAP] Could not fit bounds:', error);
      }
    }

    console.log('[SIMPLE CLUSTER MAP] Map setup complete');
  }, [restaurants, isReady]);

  if (!isReady) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {restaurants.length > 0 && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10">
          <p className="text-sm font-semibold text-gray-700">
            {restaurants.length} Restaurants
          </p>
          <p className="text-xs text-gray-500">
            Click clusters to zoom
          </p>
        </div>
      )}
      
      {restaurants.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <p className="text-gray-600">No restaurants available</p>
        </div>
      )}
    </div>
  );
}