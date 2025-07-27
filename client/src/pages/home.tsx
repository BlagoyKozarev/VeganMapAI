import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Map from '@/components/map/Map';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  veganScore: string | null;
  rating?: string;
  priceLevel?: string;
  cuisineTypes?: string[];
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { position, loading, error, getCurrentLocation } = useGeolocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['/api/restaurants/nearby', position?.lat, position?.lng],
    enabled: !!position,
    queryFn: async () => {
      const params = new URLSearchParams({
        lat: position!.lat.toString(),
        lng: position!.lng.toString(),
        radius: '2'
      });
      
      console.log('Fetching restaurants with params:', params.toString());
      const response = await fetch(`/api/restaurants/nearby?${params}`);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      
      const data = await response.json();
      console.log('Received restaurant data:', data);
      return data;
    },
  });

  useEffect(() => {
    console.log('Home component - restaurants count:', restaurants.length);
    if (restaurants.length > 0) {
      console.log('Sample restaurant scores:', restaurants.slice(0, 10).map((r: Restaurant) => ({ name: r.name, score: r.veganScore })));
    }
  }, [restaurants]);

  const handleCurrentLocation = () => {
    getCurrentPosition();
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log('Restaurant clicked:', restaurant.name);
    setSelectedRestaurant(restaurant);
    setShowActionMenu(true);
    console.log('Setting selectedRestaurant and showActionMenu to true');
    console.log('State after setting:', { showActionMenu: true, selectedRestaurant: restaurant.name });
  };

  const handleCloseActionMenu = () => {
    setShowActionMenu(false);
    setSelectedRestaurant(null);
  };

  useEffect(() => {
    console.log('Action menu state changed:', { showActionMenu, selectedRestaurant: selectedRestaurant?.name });
  }, [showActionMenu, selectedRestaurant]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vegan-green/20 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-vegan-green rounded-full animate-pulse"></div>
          </div>
          <p className="text-neutral-gray font-opensans">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (!position && error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-poppins font-semibold mb-2">Location Access Required</h2>
          <p className="text-neutral-gray font-opensans mb-6">
            VeganMapAI needs access to your location to show nearby vegan-friendly restaurants.
          </p>
          <Button 
            onClick={handleCurrentLocation}
            className="bg-vegan-green hover:bg-vegan-dark-green text-white"
          >
            <i className="fas fa-location-arrow mr-2"></i>
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative bg-gray-50">
      {/* Google Maps Style Header */}
      <div 
        className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm h-16" 
        style={{ zIndex: 1000, backgroundColor: 'white', position: 'fixed', display: 'block' }}
      >
        <div className="flex items-center px-4 py-3 h-full">
          {/* Menu Button */}
          <Button 
            variant="ghost" 
            className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="fas fa-bars text-gray-600 text-lg"></i>
          </Button>
          
          {/* Search Bar - Google Maps Style */}
          <div className="flex-1 relative">
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex items-center px-4 py-3 hover:shadow-md transition-shadow">
              <i className="fas fa-search text-gray-400 mr-3"></i>
              <input
                type="text"
                placeholder="Search for vegan places"
                className="flex-1 outline-none text-gray-700 font-opensans"
                onFocus={() => setLocation('/search')}
              />
            </div>
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center ml-3 space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/admin-scoring')}
              className="w-10 h-10 p-0 bg-purple-500 hover:bg-purple-600 rounded-full"
              title="Admin Scoring"
            >
              <span className="text-white text-lg">⚡</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/ai-chat')}
              className="w-10 h-10 p-0"
              title="AI Assistant"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🎤</span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/profile')}
              className="w-10 h-10 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center p-0"
              title="Profile"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                BK
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 pt-16" style={{ zIndex: 1 }}>
        <Map
          center={position ? [position.lat, position.lng] : [42.7, 23.16]}
          restaurants={restaurants}
          onRestaurantClick={handleRestaurantClick}
          loading={restaurantsLoading}
        />
      </div>

      {/* Vegan Score Legend - Top Right */}
      <div className="fixed top-20 right-4 bg-white border border-gray-300 rounded-lg shadow-md p-3 max-w-xs" style={{ zIndex: 999 }}>
        <h3 className="text-sm font-opensans font-semibold text-gray-700 mb-2">Vegan Score</h3>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            <span className="text-gray-600">8.5+ Excellent</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-gray-600">7.5+ Very Good</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">6.5+ Good</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600">5.5+ Fair</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">4.0+ Poor</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">&lt;4.0 Very Poor</span>
          </div>
        </div>
        
        {/* Location Button under Legend */}
        <div className="mt-3">
          <Button
            onClick={handleCurrentLocation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-location-arrow'} mr-2`}></i>
            {loading ? 'Getting Location...' : 'My Location'}
          </Button>
        </div>
      </div>



      {/* Action Menu */}
      {showActionMenu && selectedRestaurant && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg p-4 min-w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedRestaurant.name}</h3>
            <Button variant="ghost" onClick={handleCloseActionMenu} className="p-1">
              <i className="fas fa-times"></i>
            </Button>
          </div>
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              <i className="fas fa-eye mr-2"></i>
              View Details
            </Button>
            <Button className="w-full" variant="outline">
              <i className="fas fa-directions mr-2"></i>
              Navigate
            </Button>
            <Button className="w-full" variant="outline">
              <i className="fas fa-calendar mr-2"></i>
              Reserve
            </Button>
          </div>
        </div>
      )}


    </div>
  );
}