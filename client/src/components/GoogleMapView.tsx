import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GOOGLE, GOOGLE_MAPS_LIBRARIES } from '@/config/google';

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  place_id?: string;
}

interface GoogleMapViewProps {
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  className?: string;
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
  className 
}: GoogleMapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE.apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Initialize marker clusterer
    if (restaurants.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers: [],
      });
    }

    console.log('[GOOGLE MAPS] Map loaded successfully');
  }, [restaurants.length]);

  const onUnmount = useCallback(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    setMap(null);
  }, []);

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
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={GOOGLE.map.center}
        zoom={GOOGLE.map.zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Render individual markers for restaurants */}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            title={restaurant.name}
            onClick={() => handleMarkerClick(restaurant)}
          />
        ))}
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
          {selectedRestaurant.rating && (
            <p className="text-sm text-gray-600">Rating: {selectedRestaurant.rating}/5</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {selectedRestaurant.lat.toFixed(6)}, {selectedRestaurant.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}