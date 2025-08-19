import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE, GOOGLE_MAPS_LIBRARIES } from '@/config/google';
import { geoJSONLoader, type GeoJSONFeature } from '@/lib/geojson-loader';

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  place_id?: string;
  vegan_score?: number;
  address?: string;
}

interface GoogleMapViewProps {
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  className?: string;
  useCDN?: boolean; // Enable CDN data loading
}

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export default function GoogleMapView({ 
  restaurants = [], 
  onRestaurantClick,
  className,
  useCDN = true
}: GoogleMapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE.apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cdnRestaurants, setCdnRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingCDN, setIsLoadingCDN] = useState(false);
  const [cdnLoadError, setCdnLoadError] = useState<string | null>(null);
  const [cdnSource, setCdnSource] = useState<'cdn' | 'api' | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  // Load CDN restaurant data
  const loadCDNData = useCallback(async () => {
    if (!useCDN) return;
    
    setIsLoadingCDN(true);
    setCdnLoadError(null);
    
    try {
      console.log('[CDN] Loading restaurant data from CDN...');
      const result = await geoJSONLoader.load();
      
      // Convert GeoJSON features to Restaurant format
      const restaurantData: Restaurant[] = result.data.features.map((feature: GeoJSONFeature) => ({
        id: feature.properties.id,
        name: feature.properties.name,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        rating: feature.properties.rating,
        vegan_score: feature.properties.vegan_score,
        address: feature.properties.address,
        place_id: feature.properties.place_id
      }));
      
      setCdnRestaurants(restaurantData);
      setCdnSource(result.source);
      
      console.log(`[CDN] Loaded ${restaurantData.length} restaurants from ${result.source} in ${result.loadTime.toFixed(0)}ms`);
      
      if (result.error) {
        console.warn('[CDN] Fallback warning:', result.error);
      }
      
    } catch (error) {
      console.error('[CDN] Failed to load restaurant data:', error);
      setCdnLoadError(error instanceof Error ? error.message : 'Failed to load restaurant data');
    } finally {
      setIsLoadingCDN(false);
    }
  }, [useCDN]);

  // Load CDN data when component mounts
  useEffect(() => {
    loadCDNData();
  }, [loadCDNData]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    console.log('[GOOGLE MAPS] Map loaded successfully');
  }, []);

  // Update markers when restaurants or CDN data changes
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Use CDN data if available and enabled, otherwise use provided restaurants
    const restaurantData = useCDN && cdnRestaurants.length > 0 ? cdnRestaurants : restaurants;
    
    if (restaurantData.length === 0) return;

    // Create markers for restaurants
    const markers = restaurantData.map(restaurant => {
      const marker = new google.maps.Marker({
        position: { lat: restaurant.lat, lng: restaurant.lng },
        title: restaurant.name,
        icon: {
          url: getMarkerIcon(restaurant.vegan_score),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        handleMarkerClick(restaurant);
      });

      return marker;
    });

    // Initialize marker clusterer with custom styling
    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      renderer: {
        render: ({ count, position }) => {
          const color = count < 10 ? '#10b981' : count < 25 ? '#f59e0b' : '#ef4444';
          const svg = `
            <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
              <circle cx="120" cy="120" opacity=".6" r="70" />
              <circle cx="120" cy="120" opacity=".3" r="90" />
              <circle cx="120" cy="120" opacity=".2" r="110" />
              <text x="50%" y="50%" style="fill:#fff; font-size:48px; font-weight:bold;" text-anchor="middle" dy="18">${count}</text>
            </svg>`;
          
          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;base64,${btoa(svg)}`,
              scaledSize: new google.maps.Size(50, 50)
            },
            label: {
              text: String(count),
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          });
        }
      }
    });

    console.log(`[GOOGLE MAPS] Added ${markers.length} markers${useCDN ? ` from ${cdnSource}` : ''}`);
  }, [map, isLoaded, restaurants, cdnRestaurants, useCDN, cdnSource]);

  const onUnmount = useCallback(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    setMap(null);
  }, []);

  // Get marker icon based on vegan score
  const getMarkerIcon = (veganScore?: number) => {
    if (!veganScore) return '/marker-default.png';
    
    if (veganScore >= 7) return '/marker-green.png';
    if (veganScore >= 4) return '/marker-yellow.png';
    return '/marker-red.png';
  };

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    onRestaurantClick?.(restaurant);
  };

  const searchNearbyVeganRestaurants = useCallback(() => {
    if (!map || !window.google) return;

    const service = new google.maps.places.PlacesService(map);
    
    const request: google.maps.places.PlaceSearchRequest = {
      location: GOOGLE.map.center,
      radius: GOOGLE.places.queryRadiusMeters,
      type: 'restaurant',
      keyword: GOOGLE.places.keyword
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(`[GOOGLE MAPS] Found ${results.length} nearby vegan restaurants`);
        
        // Convert to our restaurant format
        const foundRestaurants: Restaurant[] = results
          .filter(place => place.geometry?.location)
          .map((place, index) => ({
            id: place.place_id || `nearby-${index}`,
            name: place.name || 'Unknown Restaurant',
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
            rating: place.rating,
            place_id: place.place_id
          }));

        // Add markers to clusterer
        if (clustererRef.current) {
          const markers = foundRestaurants.map(restaurant => 
            new google.maps.Marker({
              position: { lat: restaurant.lat, lng: restaurant.lng },
              title: restaurant.name,
              map: map
            })
          );
          
          clustererRef.current.addMarkers(markers);
        }
      } else {
        console.error('[GOOGLE MAPS] Places search failed:', status);
      }
    });
  }, [map]);

  // Calculate route between two points
  const calculateRoute = useCallback((
    origin: google.maps.LatLng | google.maps.LatLngLiteral,
    destination: google.maps.LatLng | google.maps.LatLngLiteral
  ) => {
    if (!window.google) return;

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('[GOOGLE MAPS] Route calculated successfully');
        // Handle route result here
      } else {
        console.error('[GOOGLE MAPS] Route calculation failed:', status);
      }
    });
  }, []);

  // Calculate distance and time
  const calculateTimeDistance = useCallback((
    origins: (google.maps.LatLng | google.maps.LatLngLiteral)[],
    destinations: (google.maps.LatLng | google.maps.LatLngLiteral)[]
  ) => {
    if (!window.google) return;

    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix({
      origins,
      destinations,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    }, (result, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        console.log('[GOOGLE MAPS] Distance matrix calculated successfully');
        // Handle distance matrix result here
      } else {
        console.error('[GOOGLE MAPS] Distance matrix calculation failed:', status);
      }
    });
  }, []);

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={mapContainerStyle}>
        <div className="text-center p-4">
          <p className="text-red-600 font-medium">Error loading Google Maps</p>
          <p className="text-sm text-gray-600 mt-1">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={mapContainerStyle}>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
          {useCDN && isLoadingCDN && (
            <p className="text-sm text-blue-600 mt-1">Loading restaurant data from CDN...</p>
          )}
          {cdnLoadError && (
            <p className="text-sm text-red-600 mt-1">CDN load failed, using fallback</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* CDN Status Indicator */}
      {useCDN && cdnSource && (
        <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${cdnSource === 'cdn' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          Data source: {cdnSource === 'cdn' ? 'Global CDN' : 'Local API'} 
          {cdnRestaurants.length > 0 && `(${cdnRestaurants.length} restaurants)`}
        </div>
      )}
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={GOOGLE.map.center}
        zoom={GOOGLE.map.zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Note: Markers are handled by the clusterer in useEffect */}
      </GoogleMap>

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={searchNearbyVeganRestaurants}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          disabled={!map}
        >
          Search Nearby Vegan Restaurants
        </button>
      </div>

      {/* Selected restaurant info */}
      {selectedRestaurant && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow">
          <h3 className="font-semibold">{selectedRestaurant.name}</h3>
          {selectedRestaurant.address && (
            <p className="text-sm text-gray-600 mt-1">{selectedRestaurant.address}</p>
          )}
          <div className="flex gap-4 mt-2">
            {selectedRestaurant.rating && (
              <p className="text-sm text-gray-600">Rating: {selectedRestaurant.rating}/5</p>
            )}
            {selectedRestaurant.vegan_score && (
              <p className="text-sm text-green-600">Vegan Score: {selectedRestaurant.vegan_score}/8</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selectedRestaurant.lat.toFixed(6)}, {selectedRestaurant.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}