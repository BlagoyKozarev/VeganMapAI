// OptimizedLeafletMap.tsx - High-performance map component for 250K+ restaurants
import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import MarkerCluster library and CSS  
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Proper import of MarkerCluster
import 'leaflet.markercluster';

// Ensure MarkerCluster is available on L
declare global {
  interface Window {
    L: typeof L;
  }
}

if (typeof window !== 'undefined') {
  window.L = L;
}
// Fix Leaflet icon paths for Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
// MarkerCluster types extension
declare module 'leaflet' {
  namespace L {
    function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
    
    interface MarkerClusterGroupOptions {
      chunkedLoading?: boolean;
      chunkProgress?: (processedMarkers: number, totalMarkers: number, elapsedTime: number) => void;
      maxClusterRadius?: number | ((zoom: number) => number);
      disableClusteringAtZoom?: number;
      spiderfyOnMaxZoom?: boolean;
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      removeOutsideVisibleBounds?: boolean;
      spiderfyOnEveryZoom?: boolean;
      iconCreateFunction?: (cluster: MarkerCluster) => DivIcon | Icon;
    }
    
    interface MarkerClusterGroup extends LayerGroup {
      addLayers(markers: Marker[]): this;
      removeLayers(markers: Marker[]): this;
      clearLayers(): this;
      getVisibleParent(marker: Marker): Marker | MarkerClusterGroup;
    }
    
    interface MarkerCluster {
      getChildCount(): number;
      getBounds(): LatLngBounds;
    }
  }
}
import { MapPerformanceManager } from '@/lib/MapPerformanceManager';
import { useViewportRestaurants } from '@/hooks/useRestaurants';
import { designTokens } from '@/styles/designTokens';
interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  veganScore: string;
  cuisineTypes?: string[];
  rating?: number;
  priceLevel?: number;
  address?: string;
}
interface OptimizedLeafletMapProps {
  restaurants: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onMapMove?: (bounds: any) => void;
  searchQuery?: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  highlightedRestaurants?: Set<number>;
  userFavorites?: string[];
  aiHighlightedRestaurants?: Set<number>;
  isAuthenticated?: boolean;
}
export const OptimizedLeafletMap: React.FC<OptimizedLeafletMapProps> = ({
  restaurants,
  onRestaurantClick,
  onMapMove,
  searchQuery = '',
  center = [42.6977, 23.3219], // Sofia default
  zoom = 10, // Zoom out more to show all restaurants
  className = '',
  highlightedRestaurants = new Set(),
  userFavorites = [],
  aiHighlightedRestaurants = new Set(),
  isAuthenticated = false
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const performanceManagerRef = useRef<MapPerformanceManager | null>(null);
  const currentMarkersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<any>({});
  const [mapReady, setMapReady] = useState(false);
  // Debug restaurants data on every render
  console.log('[OptimizedMap] Render with', restaurants.length, 'restaurants');
  
  useEffect(() => {
    console.log('[OptimizedMap] Restaurants changed to', restaurants.length);
  }, [restaurants.length]);

  // Initialize performance manager
  useEffect(() => {
    if (!performanceManagerRef.current) {
      performanceManagerRef.current = new MapPerformanceManager();
    }
  }, []);
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    // Mobile detection and debug
    const isMobile = window.innerWidth < 768;
    // Create map with optimized settings
    const mapOptions: any = {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true, // Use canvas for better performance
      maxZoom: 18,
      minZoom: 8,
      touchZoom: true,
      dragging: true
    };
    // Add mobile-specific options
    if (isMobile) {
      mapOptions.tap = true;
      mapOptions.tapTolerance = 40;
    }
    const map = L.map(mapContainerRef.current, mapOptions);
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      updateWhenZooming: false, // Performance optimization
      updateWhenIdle: true
    }).addTo(map);
    // Check if MarkerClusterGroup is available and create cluster group
    let clusterGroup: any;
    
    // Check if MarkerClusterGroup is available 
    const hasMarkerCluster = typeof (L as any).markerClusterGroup === 'function';
    console.log('[OptimizedMap] MarkerCluster available:', hasMarkerCluster);
    
    if (hasMarkerCluster) {
      console.log('[OptimizedMap] MarkerCluster library loaded successfully');
      clusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnEveryZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 60,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let className, size;
          
          // Google Maps style clustering with vegan colors
          if (count <= 20) {
            className = 'vg-cluster vg-cl-small';
            size = 35;
          } else if (count <= 50) {
            className = 'vg-cluster vg-cl-medium'; 
            size = 45;
          } else {
            className = 'vg-cluster vg-cl-large';
            size = 55;
          }
          
          return L.divIcon({
            html: `<div class="${className}"><span>${count}</span></div>`,
            className: 'vg-cluster-marker',
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
          });
        }
      });
    } else {
      console.warn('[OptimizedMap] MarkerCluster not available. Using regular LayerGroup.');
      clusterGroup = L.layerGroup();
    }
    map.addLayer(clusterGroup);
    mapRef.current = map;
    markerClusterGroupRef.current = clusterGroup;
    // Force map invalidation on mobile after initialization
    if (isMobile) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      // Additional mobile fix for Safari
      setTimeout(() => {
        map.invalidateSize(true);
      }, 500);
    }
    // Set up viewport change handling with throttling
    const handleViewportChange = throttle(() => {
      if (!mapRef.current || !performanceManagerRef.current) return;
      const bounds = mapRef.current.getBounds();
      const zoom = mapRef.current.getZoom();
      const viewportBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        zoom: zoom
      };
      // Update performance manager
      const visibleRestaurants = performanceManagerRef.current.updateViewport(viewportBounds);
      // Update markers
      updateMarkers(visibleRestaurants);
      // Update stats
      setPerformanceStats(performanceManagerRef.current.getStatistics());
      // Callback
      onMapMove?.(viewportBounds);
    }, 300);
    map.on('moveend', handleViewportChange);
    map.on('zoomend', handleViewportChange);
    setMapReady(true);
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      performanceManagerRef.current?.cleanup();
    };
  }, [center, zoom, onMapMove]);
  // Initialize restaurant dataset
  useEffect(() => {
    if (!performanceManagerRef.current || !restaurants.length) return;
    const initializeData = async () => {
      setIsLoading(true);
      // Add timeout to prevent infinite loading on mobile
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3 second timeout
      try {
        await performanceManagerRef.current!.initializeDataset(restaurants);
        // Initial viewport update
        if (mapRef.current) {
          const bounds = mapRef.current.getBounds();
          const zoom = mapRef.current.getZoom();
          const viewportBounds = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
            zoom: zoom
          };
          const visibleRestaurants = performanceManagerRef.current!.updateViewport(viewportBounds);
          updateMarkers(visibleRestaurants);
        }
        setPerformanceStats(performanceManagerRef.current!.getStatistics());
      } catch (error) {
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };
    initializeData();
  }, [restaurants]);
  // Handle search
  useEffect(() => {
    if (!performanceManagerRef.current || !mapReady) return;
    const searchResults = performanceManagerRef.current.searchInViewport(searchQuery);
    updateMarkers(searchResults);
  }, [searchQuery, mapReady]);
  // OPTIMIZED Update markers function with batching and performance improvements
  const updateMarkers = useCallback((restaurantsToShow: Restaurant[]) => {
    if (!markerClusterGroupRef.current) {
      return;
    }
    // Skip if restaurants count is too low
    if (restaurantsToShow.length === 0) {
      markerClusterGroupRef.current.clearLayers();
      currentMarkersRef.current = [];
      return;
    }
    const startTime = performance.now();
    // Clear existing markers efficiently
    markerClusterGroupRef.current.clearLayers();
    currentMarkersRef.current = [];
    // Create new markers with optimizations
    const markers: L.Marker[] = [];
    // Limit markers for performance
    const limitedRestaurants = restaurantsToShow.slice(0, 500);
    limitedRestaurants.forEach(restaurant => {
      const score = parseFloat(restaurant.veganScore) || 0;
      const isAIHighlighted = aiHighlightedRestaurants.has(parseInt(restaurant.id));
      const isFavorite = userFavorites.includes(restaurant.id);
      const scoreColor = isAIHighlighted ? '#9333ea' : getScoreColor(score);
      // Use lighter weight marker for performance
      const marker = L.marker([restaurant.latitude, restaurant.longitude], {
        icon: createOptimizedIcon(score, scoreColor, isAIHighlighted, isFavorite),
        riseOnHover: false // Disable hover effect for performance
      });
      // Add popup with restaurant info
      const popup = marker.bindPopup(createPopupContent(restaurant), {
        maxWidth: 300,
        className: 'custom-popup'
      });
      // Add event listener when popup opens
      marker.on('popupopen', () => {
        const popupContent = popup.getPopup();
        if (popupContent) {
          const popupElement = popupContent.getElement();
          if (popupElement) {
            const infoIcon = popupElement.querySelector('.info-icon');
            const scoreExplanation = popupElement.querySelector('.score-explanation') as HTMLElement;
            if (infoIcon && scoreExplanation) {
              infoIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = scoreExplanation.style.display === 'none';
                scoreExplanation.style.display = isHidden ? 'block' : 'none';
              });
            }
          }
        }
      });
      // Click handler
      marker.on('click', () => {
        onRestaurantClick?.(restaurant);
      });
      markers.push(marker);
    });
    // Log first few restaurant coordinates for debugging
    if (restaurantsToShow.length > 0) {
    }
    // Add markers to cluster group in batches for better performance
    const batchSize = 50; // Reduced batch size for better responsiveness
    // Use requestAnimationFrame to prevent UI blocking
    let i = 0;
    const addBatch = () => {
      if (i < markers.length && markerClusterGroupRef.current) {
        const batch = markers.slice(i, Math.min(i + batchSize, markers.length));
        
        // Check if it's a cluster group or regular layer group
        if (markerClusterGroupRef.current && markerClusterGroupRef.current.addLayers && typeof markerClusterGroupRef.current.addLayers === 'function') {
          // It's a cluster group
          markerClusterGroupRef.current.addLayers(batch);
        } else if (markerClusterGroupRef.current) {
          // It's a regular layer group - add markers one by one
          batch.forEach((marker: L.Marker) => markerClusterGroupRef.current!.addLayer(marker));
        }
        
        i += batchSize;
        requestAnimationFrame(addBatch);
      }
    };
    requestAnimationFrame(addBatch);
    currentMarkersRef.current = markers;
    const renderTime = performance.now() - startTime;
    // Performance logging removed for production
  }, [onRestaurantClick, userFavorites, aiHighlightedRestaurants]);
  // Create optimized marker icon
  const createOptimizedIcon = (score: number, color: string, isHighlighted: boolean = false, isFavorite: boolean = false): L.DivIcon => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="width: 30px; height: 30px; background-color: ${color}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <div style="transform: rotate(45deg); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); color: white; font-weight: bold; font-size: 12px;">
            ${score.toFixed(1)}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  };
  // Get color based on vegan score
  const getScoreColor = (score: number): string => {
    if (score >= 4) return '#22c55e'; // Green
    if (score >= 3) return '#eab308'; // Yellow
    if (score >= 2) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };
  // Create popup content
  const createPopupContent = (restaurant: Restaurant): string => {
    const score = parseFloat(restaurant.veganScore) || 0;
    // Cap score at 5 for star display (some restaurants have scores > 5)
    const cappedScore = Math.min(5, Math.max(0, Math.round(score)));
    const stars = '★'.repeat(cappedScore) + '☆'.repeat(5 - cappedScore);
    const getScoreText = (score: number) => {
      if (score >= 4.5) return "Excellent vegan options";
      if (score >= 3.5) return "Good vegan choices";
      if (score >= 2.5) return "Some vegan options";
      if (score >= 1.5) return "Limited vegan options";
      return "Few vegan options";
    };
    return `
      <div class="restaurant-popup">
        <h3 class="popup-title">${restaurant.name}</h3>
        <div class="popup-score">
          <span class="stars">${stars}</span>
          <span class="score-value">${score.toFixed(1)}/5</span>
          <span class="info-icon" title="Click for score details">ℹ️</span>
        </div>
        <div class="score-description">${getScoreText(score)}</div>
        <div class="score-explanation" style="display: none;">
          <div class="explanation-header">AI Vegan Score Analysis</div>
          <div class="explanation-content">
            <p>Score based on:</p>
            <ul>
              <li>Menu analysis for vegan options</li>
              <li>Ingredient transparency</li>
              <li>Kitchen safety practices</li>
              <li>Staff training on dietary needs</li>
            </ul>
            <div class="explanation-footer">Powered by AI • Updated regularly</div>
          </div>
        </div>
        ${restaurant.cuisineTypes?.length ? 
          `<div class="popup-cuisine">${restaurant.cuisineTypes.join(', ')}</div>` : ''
        }
        ${restaurant.address ? 
          `<div class="popup-address">${restaurant.address}</div>` : ''
        }
      </div>
    `;
  };
  // Throttle function for performance
  function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ 
          minHeight: '400px', 
          height: '100%',
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#f5f5f5'
        }}
      />
      {/* Loading overlay - only show briefly */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center" 
             style={{ zIndex: 10, pointerEvents: 'none' }}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      {/* Performance stats overlay (development) */}
      {process.env.NODE_ENV === 'development' && Object.keys(performanceStats).length > 0 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-[1000]">
          <div className="font-bold mb-2">Performance Stats</div>
          <div>Total: {performanceStats.totalRestaurants?.toLocaleString()}</div>
          <div>Visible: {performanceStats.visibleRestaurants?.toLocaleString()}</div>
          <div>Memory: {performanceStats.memoryEstimate}</div>
          <div>Markers: {currentMarkersRef.current.length}</div>
        </div>
      )}
      {/* Optimized cluster styles for performance */}
      <style>{`
        .cluster-icon {
          background: none !important;
          border: none !important;
        }
        .cluster-marker {
          background: #3B82F6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          will-change: transform; /* Optimize for animations */
        }
        .cluster-small { 
          width: 30px; 
          height: 30px; 
          font-size: 11px;
          background: #10b981;
        }
        .cluster-medium { 
          width: 40px; 
          height: 40px; 
          font-size: 12px;
          background: #f59e0b;
        }
        .cluster-large { 
          width: 50px; 
          height: 50px; 
          font-size: 14px;
          background: #ef4444;
        }
        .custom-marker {
          background: none;
          border: none;
        }
        .marker-pin {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .restaurant-popup {
          min-width: 200px;
        }
        .popup-title {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: #1f2937;
        }
        .popup-score {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .stars {
          color: #f59e0b;
          letter-spacing: 2px;
        }
        .score-value {
          color: #6b7280;
          font-size: 14px;
        }
        .popup-cuisine {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }
        .popup-address {
          color: #9ca3af;
          font-size: 12px;
          line-height: 1.4;
        }
        .info-icon {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
          font-size: 14px;
        }
        .info-icon:hover {
          opacity: 1;
        }
        .score-description {
          color: #4b5563;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .score-explanation {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .explanation-header {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .explanation-content {
          font-size: 12px;
          color: #6b7280;
        }
        .explanation-content p {
          margin: 0 0 6px 0;
        }
        .explanation-content ul {
          margin: 0;
          padding-left: 16px;
          list-style: disc;
        }
        .explanation-content li {
          margin: 2px 0;
        }
        .explanation-footer {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
export default OptimizedLeafletMap;