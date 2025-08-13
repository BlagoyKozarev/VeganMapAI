import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import MarkerCluster library and CSS
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix Leaflet icon paths for Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

// Fix default markers
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
});

// Type definition for MarkerCluster
declare global {
  namespace L {
    function markerClusterGroup(options?: any): any;
  }
}

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  veganScore: number;
  address?: string;
  rating?: number;
}

export default function PreviewMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('[PREVIEW MAP] PreviewMap component loading...', { 
    restaurantCount: restaurants.length,
    loading 
  });

  // Fetch restaurants data for preview
  useEffect(() => {
    console.log('[PREVIEW MAP] Fetching restaurants...');
    
    fetch(`/api/restaurants/public/map-data?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        console.log('[PREVIEW MAP] Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('[PREVIEW MAP] Full API response:', data);
        
        if (data.success && data.restaurants && Array.isArray(data.restaurants)) {
          console.log('[PREVIEW MAP] Successfully fetched', data.restaurants.length, 'restaurants');
          console.log('[PREVIEW MAP] First restaurant sample:', data.restaurants[0]);
          setRestaurants(data.restaurants);
        } else {
          console.warn('[PREVIEW MAP] Invalid data format:', data);
          setRestaurants([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('[PREVIEW MAP] Fetch error:', err);
        setRestaurants([]);
        setLoading(false);
      });
  }, []);

  // Initialize map with clustering
  useEffect(() => {
    if (!mapRef.current) {
      console.log('[PREVIEW MAP] Map container not ready');
      return;
    }

    if (loading) {
      console.log('[PREVIEW MAP] Still loading data...');
      return;
    }

    if (restaurants.length === 0) {
      console.log('[PREVIEW MAP] No restaurants data available');
      return;
    }

    console.log('[PREVIEW MAP] Initializing map with', restaurants.length, 'restaurants');

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      console.log('[PREVIEW MAP] Cleaned up existing map');
    }

    // Clear any cached map containers
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    // Create map centered on Sofia, Bulgaria
    const map = L.map(mapRef.current, {
      center: [42.6977, 23.3219], // Sofia coordinates
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    console.log('[PREVIEW MAP] Base map created successfully');

    // Create marker cluster group with custom options
    let clusterGroup;
    
    try {
      // Use proper marker cluster initialization
      clusterGroup = (L as any).markerClusterGroup({
        // Custom cluster icon creation function
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let color = '#22c55e'; // green for small clusters (1-20)
          let size = 40;
          let textColor = 'white';
          
          if (count > 50) {
            color = '#ef4444'; // red for large clusters (50+)
            size = 60;
          } else if (count > 20) {
            color = '#f97316'; // orange for medium clusters (21-50)  
            size = 50;
          }

          return L.divIcon({
            html: `<div style="
              background: ${color};
              color: ${textColor};
              border-radius: 50%;
              width: ${size}px;
              height: ${size}px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${size > 50 ? '18px' : size > 40 ? '16px' : '14px'};
              box-shadow: 0 3px 8px rgba(0,0,0,0.3);
              border: 3px solid white;
              cursor: pointer;
              transition: all 0.2s ease;
            ">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
          });
        },
        // Clustering options
        maxClusterRadius: 50,
        disableClusteringAtZoom: 16,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        chunkedLoading: true,
        chunkProgress: (processed: number, total: number) => {
          console.log(`[PREVIEW MAP] Clustering progress: ${processed}/${total}`);
        }
      });
      
      console.log('[PREVIEW MAP] Marker cluster group created successfully');
    } catch (error) {
      console.error('[PREVIEW MAP] Error creating cluster group:', error);
      // Fallback to regular layer group
      clusterGroup = L.layerGroup();
    }

    // Process and add markers to cluster group
    let markersAdded = 0;
    const validRestaurants = restaurants.filter(r => 
      r.latitude && r.longitude && !isNaN(r.latitude) && !isNaN(r.longitude)
    );
    
    console.log('[PREVIEW MAP] Processing', validRestaurants.length, 'valid restaurants out of', restaurants.length, 'total');
    
    validRestaurants.forEach((restaurant, index) => {
      try {
        // Create custom icon based on vegan score
        const score = restaurant.veganScore || 0;
        let iconColor = '#22c55e'; // green default
        
        if (score >= 8) iconColor = '#16a34a'; // dark green for high scores
        else if (score >= 6) iconColor = '#22c55e'; // green for good scores  
        else if (score >= 4) iconColor = '#eab308'; // yellow for medium scores
        else iconColor = '#ef4444'; // red for low scores

        const customIcon = L.divIcon({
          html: `<div style="
            width: 12px; 
            height: 12px; 
            background-color: ${iconColor}; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></div>`,
          className: 'custom-restaurant-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        
        const marker = L.marker([restaurant.latitude, restaurant.longitude], {
          icon: customIcon,
          title: `${restaurant.name} (Score: ${score}/10)`
        });
        
        // Add popup with restaurant info
        marker.bindPopup(`
          <div style="min-width: 200px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${restaurant.name}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Vegan Score:</strong> ${score}/10
            </p>
            ${restaurant.address ? `
              <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
                📍 ${restaurant.address}
              </p>
            ` : ''}
            ${restaurant.rating ? `
              <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
                ⭐ Rating: ${restaurant.rating}/5
              </p>
            ` : ''}
          </div>
        `);
        
        clusterGroup.addLayer(marker);
        markersAdded++;
      } catch (error) {
        console.warn('[PREVIEW MAP] Error adding marker for restaurant:', restaurant.name, error);
      }
    });

    console.log('[PREVIEW MAP] Successfully added', markersAdded, 'markers to cluster group');

    // Add cluster group to map
    map.addLayer(clusterGroup);
    
    // Fit map to show all markers
    if (markersAdded > 0) {
      try {
        const group = (L as any).featureGroup(clusterGroup.getLayers());
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
        console.log('[PREVIEW MAP] Map bounds adjusted to show all markers');
      } catch (error) {
        console.warn('[PREVIEW MAP] Could not fit bounds, using default view');
      }
    }

    console.log('[PREVIEW MAP] Map initialization complete');

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log('[PREVIEW MAP] Map cleaned up');
      }
    };
  }, [restaurants, loading]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {restaurants.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No restaurant data available</p>
            <p className="text-sm text-gray-500">Please check your connection</p>
          </div>
        </div>
      )}
      
      {restaurants.length > 0 && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-700">
            {restaurants.length} Restaurants
          </p>
        </div>
      )}
    </div>
  );
}