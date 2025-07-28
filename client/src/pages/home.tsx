import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Map from '@/components/map/Map';
import { RestaurantModal } from '@/components/map/RestaurantModal';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  veganScore: string | null;
  rating?: string | null;
  priceLevel?: string;
  cuisineTypes?: string[];
  website?: string | null;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { position, loading, error, getCurrentPosition } = useGeolocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Check URL parameters for custom location
  const urlParams = new URLSearchParams(window.location.search);
  const customLat = urlParams.get('lat');
  const customLng = urlParams.get('lng');
  
  // Use custom location if provided, otherwise use geolocation
  const currentPosition = customLat && customLng ? 
    { lat: parseFloat(customLat), lng: parseFloat(customLng) } : 
    position;

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['/api/restaurants/all-available'],
    queryFn: async () => {
      console.log('Fetching all available restaurants with AI scores');
      const response = await fetch('/api/restaurants/all-available');
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

  // Filter restaurants and generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = restaurants.filter((restaurant: any) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      
      // Generate suggestions - top 5 matching restaurants
      const suggestions = restaurants
        .filter((restaurant: any) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map((restaurant: any) => ({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          veganScore: restaurant.veganScore,
          type: 'restaurant'
        }));
      
      // Add cuisine suggestions
      const cuisineSuggestions = Array.from(
        new Set(
          restaurants
            .filter((r: any) => r.cuisineTypes)
            .flatMap((r: any) => r.cuisineTypes)
            .filter((cuisine: string) => 
              cuisine.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !['point_of_interest', 'establishment', 'food', 'restaurant'].includes(cuisine)
            )
        )
      ).slice(0, 3).map((cuisine: string) => ({
        id: cuisine,
        name: cuisine.replace(/_/g, ' ').toLowerCase(),
        type: 'cuisine'
      }));
      
      setSearchSuggestions([...suggestions, ...cuisineSuggestions]);
      setShowSuggestions(searchQuery.length > 1);
    }
  }, [restaurants, searchQuery]);

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'restaurant') {
      setSearchQuery(suggestion.name);
    } else if (suggestion.type === 'cuisine') {
      setSearchQuery(suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleCurrentLocation = () => {
    getCurrentPosition();
  };

  const handleRestaurantClick = (restaurant: any) => {
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto" style={{ zIndex: 1002 }}>
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.type}-${suggestion.id}`}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center">
                      <i className={`fas ${suggestion.type === 'restaurant' ? 'fa-utensils' : 'fa-tag'} text-gray-400 mr-3`}></i>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        {suggestion.address && (
                          <div className="text-sm text-gray-500">{suggestion.address}</div>
                        )}
                        {suggestion.veganScore && (
                          <div className="text-sm text-green-600">Vegan Score: {suggestion.veganScore}/10</div>
                        )}
                        {suggestion.type === 'cuisine' && (
                          <div className="text-sm text-blue-600">Cuisine type</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center ml-3 space-x-2">
            <a href="/api-stats">
              <Button 
                variant="ghost" 
                className="w-10 h-10 p-0 bg-orange-500 hover:bg-orange-600 rounded-full"
                title="API Stats"
              >
                <span className="text-white text-lg">📊</span>
              </Button>
            </a>
            <a href="/admin-scoring">
              <Button 
                variant="ghost" 
                className="w-10 h-10 p-0 bg-purple-500 hover:bg-purple-600 rounded-full"
                title="Admin Scoring"
              >
                <span className="text-white text-lg">⚡</span>
              </Button>
            </a>
            <a href="/ai-chat">
              <Button 
                variant="ghost" 
                className="w-10 h-10 p-0"
                title="AI Assistant"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🎤</span>
                </div>
              </Button>
            </a>
            <a href="/profile">
              <Button 
                variant="ghost" 
                className="w-10 h-10 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center p-0"
                title="Profile"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  BK
                </div>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Map Container with overlay for closing action menu */}
      <div 
        className="absolute inset-0 pt-16" 
        style={{ zIndex: 1 }}
        onClick={() => {
          // Close action menu when clicking on map
          if (showActionMenu) {
            setShowActionMenu(false);
            setSelectedRestaurant(null);
          }
        }}
      >
        <Map
          center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [42.7, 23.16]}
          restaurants={filteredRestaurants}
          onRestaurantClick={handleRestaurantClick}
          onLocationChange={(newCenter) => {
            // Refresh page with new coordinates to trigger restaurant reload
            window.location.reload();
          }}
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
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1001] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-80 max-w-sm"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-poppins font-bold text-gray-900 mb-1">{selectedRestaurant.name}</h3>
              <div className="flex items-center mb-2">
                <div className="bg-vegan-green text-white rounded-full px-3 py-1 text-sm font-medium mr-2">
                  {selectedRestaurant.veganScore ? parseFloat(selectedRestaurant.veganScore).toFixed(1) : '?'}
                </div>
                <span className="text-sm text-gray-600">Vegan Score</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{selectedRestaurant.address}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleCloseActionMenu} 
              className="p-2 hover:bg-gray-100 rounded-full -mt-1 -mr-1"
            >
              <span className="text-gray-400 text-xl">×</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-vegan-green hover:bg-vegan-dark-green text-white py-3 px-4 rounded-xl font-medium text-base"
              onClick={() => {
                setLocation(`/restaurant/${selectedRestaurant.id}`);
              }}
            >
              <i className="fas fa-eye mr-2"></i>
              View Details
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium"
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                <i className="fas fa-directions mr-1"></i>
                Navigate
              </Button>
              
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-medium"
                onClick={() => {
                  if (selectedRestaurant.website) {
                    window.open(selectedRestaurant.website, '_blank');
                  } else {
                    // Fallback to Google search
                    const searchQuery = encodeURIComponent(`${selectedRestaurant.name} Sofia restaurant`);
                    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                  }
                }}
              >
                <i className="fas fa-globe mr-1"></i>
                Website
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant}
          isOpen={showRestaurantModal}
          onClose={() => {
            setShowRestaurantModal(false);
            setSelectedRestaurant(null);
          }}
        />
      )}

    </div>
  );
}