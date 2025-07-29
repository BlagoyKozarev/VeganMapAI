import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Map from '@/components/map/Map';
import { RestaurantModal } from '@/components/map/RestaurantModal';
import { RestaurantDropdown } from '@/components/ui/restaurant-dropdown';
import { MobileFilterDrawer } from '@/components/mobile/MobileFilterDrawer';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Restaurant {
  id: string;
  name: string;
  placeId: string | null;
  address: string;
  latitude: string;
  longitude: string;
  phoneNumber: string | null;
  website: string | null;
  priceLevel: number | null;
  cuisineTypes: string[] | null;
  rating: string | null;
  reviewCount: number;
  veganScore: string | null;
  veganScoreBreakdown: any | null;
  openingHours: any | null;
  photos: any | null;
  isVerified: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { position, loading, error, getCurrentPosition } = useGeolocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // Removed position state since we're using bottom footer
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [minVeganScore, setMinVeganScore] = useState(0);
  const [minGoogleScore, setMinGoogleScore] = useState(0);
  
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

  // Log restaurants data once when loaded
  useEffect(() => {
    if (restaurants.length > 0) {
      console.log('Home component - restaurants count:', restaurants.length);
      console.log('Sample restaurant scores:', restaurants.slice(0, 10).map((r: Restaurant) => ({ name: r.name, score: r.veganScore })));
    }
  }, [restaurants.length]); // Stable dependency

  // Filter restaurants based on search query and scores - memoized to prevent loops
  useEffect(() => {
    if (!restaurants.length) {
      if (filteredRestaurants.length > 0) {
        setFilteredRestaurants([]);
      }
      return;
    }

    let filtered = restaurants;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((restaurant: any) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply vegan score filter
    filtered = filtered.filter((restaurant: any) => {
      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      return veganScore >= minVeganScore;
    });
    
    // Apply Google score filter
    filtered = filtered.filter((restaurant: any) => {
      const googleScore = restaurant.rating ? parseFloat(restaurant.rating) : 0;
      return googleScore >= minGoogleScore;
    });
    
    // Only update if actually different to prevent loops
    if (JSON.stringify(filtered) !== JSON.stringify(filteredRestaurants)) {
      setFilteredRestaurants(filtered);
      console.log('Showing', filtered.length, 'restaurants');
    }
  }, [restaurants.length, searchQuery, minVeganScore, minGoogleScore]); // Use length instead of full array

  // Generate search suggestions separately to avoid complex dependencies
  useEffect(() => {
    if (!restaurants.length) {
      setSearchSuggestions([]);
      return;
    }

    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
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
          .filter((cuisine: any) => 
            typeof cuisine === 'string' &&
            cuisine.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !['point_of_interest', 'establishment', 'food', 'restaurant'].includes(cuisine)
          )
      )
    ).slice(0, 3).map((cuisine: any) => ({
      id: cuisine as string,
      name: (cuisine as string).replace(/_/g, ' ').toLowerCase(),
      type: 'cuisine'
    }));
    
    setSearchSuggestions([...suggestions, ...cuisineSuggestions]);
    setShowSuggestions(searchQuery.length > 1);
  }, [restaurants.length, searchQuery]); // Only essential dependencies

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'restaurant') {
      setSearchQuery(suggestion.name);
    } else if (suggestion.type === 'cuisine') {
      setSearchQuery(suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleCurrentLocation = () => {
    // Get fresh location data
    getCurrentPosition();
  };

  const handleRestaurantClick = (restaurant: any, event?: any) => {
    console.log('Restaurant clicked:', restaurant.name);
    setSelectedRestaurant(restaurant);
    setShowDropdown(true);
    console.log('Setting selectedRestaurant and showDropdown to true');
  };

  const handleNavigate = () => {
    if (selectedRestaurant) {
      // Enhanced mobile-compatible navigation
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}&travelmode=walking`;
      
      console.log('Opening navigation to:', url);
      
      // Try multiple methods for mobile compatibility
      try {
        const opened = window.open(url, '_blank');
        if (!opened) {
          // Fallback for mobile browsers that block popups
          window.location.href = url;
        }
      } catch (error) {
        console.log('Popup blocked, using direct navigation');
        window.location.href = url;
      }
      
      setShowDropdown(false);
    }
  };

  const handleViewDetails = () => {
    setShowDropdown(false);
    setShowRestaurantModal(true);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const handleCloseModal = () => {
    setShowRestaurantModal(false);
    setSelectedRestaurant(null);
  };





  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl mb-6 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse shadow-md"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">VeganMapAI</h2>
          <p className="text-gray-600 font-opensans">Getting your location...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!position && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-3xl mb-6">
            <i className="fas fa-map-marker-alt text-red-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Location Access Required</h2>
          <p className="text-gray-600 font-opensans mb-8 leading-relaxed">
            VeganMapAI needs access to your location to show nearby vegan-friendly restaurants and provide personalized recommendations.
          </p>
          <Button 
            onClick={handleCurrentLocation}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <i className="fas fa-location-arrow mr-3"></i>
            Enable Location Access
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Your location data is used only for restaurant recommendations and is not stored.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative bg-gray-50">

      
      {/* Mobile Header */}
      <div className="sm:hidden">
        <MobileHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSuggestions={showSuggestions}
          onShowSuggestions={setShowSuggestions}
          searchSuggestions={searchSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>


      
      {/* Enhanced Google Maps Style Header - Desktop Only */}
      <div 
        className="hidden sm:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm h-16" 
        style={{ zIndex: 1000 }}
      >
        <div className="flex items-center px-2 sm:px-4 py-3 h-full max-w-7xl mx-auto">
          {/* Menu Button - Hidden on mobile */}
          <Button 
            variant="ghost" 
            className="hidden sm:flex p-2 mr-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
          >
            <i className="fas fa-bars text-gray-600 text-lg"></i>
          </Button>
          
          {/* Search Bar - Enhanced Google Maps Style */}
          <div className="flex-1 relative max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-full shadow-sm flex items-center px-4 py-2.5 hover:shadow-lg transition-all duration-200 focus-within:shadow-lg focus-within:border-blue-400">
              <i className="fas fa-search text-gray-400 mr-3 text-sm"></i>
              <input
                type="text"
                placeholder="Search for vegan places..."
                className="flex-1 outline-none text-gray-700 font-opensans text-sm bg-transparent"
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
                  className="text-gray-400 hover:text-gray-600 ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
            
            {/* Enhanced Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl mt-2 max-h-80 overflow-y-auto backdrop-blur-sm" style={{ zIndex: 1002 }}>
                <div className="p-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.id}`}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-xl transition-all duration-150 hover:scale-[1.02] group"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          suggestion.type === 'restaurant' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        } group-hover:scale-110 transition-transform`}>
                          <i className={`fas ${suggestion.type === 'restaurant' ? 'fa-utensils' : 'fa-tag'} text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{suggestion.name}</div>
                          {suggestion.address && (
                            <div className="text-xs text-gray-500 mt-0.5 truncate">{suggestion.address}</div>
                          )}
                          {suggestion.veganScore && (
                            <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                              <i className="fas fa-leaf mr-1"></i>
                              Vegan Score: {suggestion.veganScore}/10
                            </div>
                          )}
                          {suggestion.type === 'cuisine' && (
                            <div className="text-xs text-blue-600 font-medium mt-1 flex items-center">
                              <i className="fas fa-utensils mr-1"></i>
                              Cuisine type
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Right Icons */}
          <div className="flex items-center ml-2 sm:ml-3 space-x-1 sm:space-x-2">
            <a href="/admin" className="hidden sm:block">
              <Button 
                variant="ghost" 
                className="w-9 h-9 sm:w-10 sm:h-10 p-0 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                title="Admin Panel"
              >
                <span className="text-white text-sm sm:text-lg">⚙️</span>
              </Button>
            </a>
            <a href="/ai-chat">
              <Button 
                variant="ghost" 
                className="w-9 h-9 sm:w-10 sm:h-10 p-0 hover:scale-105 transition-all duration-200"
                title="AI Assistant"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl">
                  <span className="text-white text-sm sm:text-lg font-bold">🎤</span>
                </div>
              </Button>
            </a>
            <a href="/profile">
              <Button 
                variant="ghost" 
                className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center p-0 hover:scale-105"
                title="Profile"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-lg">
                  BK
                </div>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Map Container - Force Mobile Optimization */}
      <div 
        className="absolute inset-0 pt-14 sm:pt-16" 
        style={{ 
          zIndex: 1, 
          minHeight: '100vh',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
        }}
      >
        {/* Mobile Map with Leaflet */}
        <div className="sm:hidden w-full h-full relative">
          <Map
            center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [42.7, 23.16]}
            restaurants={filteredRestaurants}
            onRestaurantClick={handleRestaurantClick}
            onLocationChange={() => {
              // Map center is managed internally by Leaflet
            }}
            loading={restaurantsLoading}
          />
          
          {/* Mobile Vegan Score Legend */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-44 z-[998]"
               style={{ 
                 zIndex: showDropdown ? 1 : 999,
                 opacity: showDropdown ? 0.7 : 1
               }}>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-green-600 text-xs">🌱</span>
              </div>
              <h3 className="text-xs font-bold text-gray-800">Vegan Guide</h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-xs hover:bg-green-50 rounded px-1 py-0.5 transition-colors">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span className="text-gray-700">8.5+ Excellent</span>
              </div>
              <div className="flex items-center text-xs hover:bg-green-50 rounded px-1 py-0.5 transition-colors">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-700">7.5+ Very Good</span>
              </div>
              <div className="flex items-center text-xs hover:bg-yellow-50 rounded px-1 py-0.5 transition-colors">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-700">6.5+ Good</span>
              </div>
              <div className="flex items-center text-xs hover:bg-orange-50 rounded px-1 py-0.5 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-700">5.5+ Fair</span>
              </div>
              <div className="flex items-center text-xs hover:bg-red-50 rounded px-1 py-0.5 transition-colors">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-700">&lt;5.5 Poor</span>
              </div>
            </div>
          </div>

          {/* Mobile Filter Controls - Fixed Window */}
          <div className="absolute bottom-25 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-44 z-[998]"
               style={{ 
                 zIndex: showDropdown ? 1 : 998,
                 opacity: showDropdown ? 0.7 : 1
               }}>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-xs">🎚️</span>
              </div>
              <h3 className="text-xs font-bold text-gray-800">Filters</h3>
            </div>
            
            <div className="space-y-3">
              {/* Min Vegan Score Filter */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Min Vegan: {minVeganScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minVeganScore}
                  onChange={(e) => setMinVeganScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              {/* Min Google Score Filter */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Min Google: {minGoogleScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minGoogleScore}
                  onChange={(e) => setMinGoogleScore(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Map */}
        <div className="hidden sm:block w-full h-full">
          <Map
            center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [42.7, 23.16]}
            restaurants={filteredRestaurants}
            onRestaurantClick={handleRestaurantClick}
            onLocationChange={() => {
              // Map center is managed internally by Leaflet
            }}
            loading={restaurantsLoading}
          />
        </div>
      </div>

      {/* Enhanced Vegan Score Legend - Desktop Only */}
      <div className="hidden sm:block fixed top-20 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-52 transition-all duration-300 hover:shadow-xl" 
           style={{ 
             zIndex: showDropdown ? 1 : 999,
             opacity: showDropdown ? 0.7 : 1
           }}>
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-green-600 text-xs">🌱</span>
          </div>
          <h3 className="text-xs font-opensans font-bold text-gray-800">Vegan Guide</h3>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-xs hover:bg-green-50 rounded px-1 py-0.5 transition-colors">
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">8.5+ Excellent</span>
          </div>
          <div className="flex items-center text-xs hover:bg-green-50 rounded px-1 py-0.5 transition-colors">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">7.5+ Very Good</span>
          </div>
          <div className="flex items-center text-xs hover:bg-yellow-50 rounded px-1 py-0.5 transition-colors">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">6.5+ Good</span>
          </div>
          <div className="flex items-center text-xs hover:bg-orange-50 rounded px-1 py-0.5 transition-colors">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">5.5+ Fair</span>
          </div>
          <div className="flex items-center text-xs hover:bg-red-50 rounded px-1 py-0.5 transition-colors">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-700 font-medium">&lt;5.5 Poor</span>
          </div>
        </div>
        
        {/* Compact Location Button */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <Button
            onClick={handleCurrentLocation}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-1.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-xs font-medium"
            disabled={loading}
          >
            <span className="mr-1">📍</span>
            {loading ? 'Loading...' : 'My Location'}
          </Button>
        </div>
      </div>





      {/* Enhanced Filter Controls - Desktop Only */}
      <div className="hidden sm:block fixed bottom-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-52 transition-all duration-300 hover:shadow-xl" 
           style={{ 
             zIndex: showDropdown ? 1 : 998,  // Lower z-index than legend
             opacity: showDropdown ? 0.7 : 1,
             transform: showDropdown ? 'translateY(10px)' : 'translateY(0)'
           }}>
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-blue-600 text-xs">🎚️</span>
          </div>
          <h3 className="text-xs font-opensans font-bold text-gray-800">Filters</h3>
        </div>
        
        <div className="space-y-3">
          {/* Min Vegan Score Filter */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Min Vegan Score: {minVeganScore}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minVeganScore}
              onChange={(e) => setMinVeganScore(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  #fecaca 0%, #fde68a 50%, #bbf7d0 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Min Google Score Filter */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Min Google Score: {minGoogleScore}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={minGoogleScore}
              onChange={(e) => setMinGoogleScore(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  #fecaca 0%, #bbf7d0 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>2.5</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>



      {/* Restaurant Dropdown */}
      {selectedRestaurant && showDropdown && (
        <RestaurantDropdown
          restaurant={selectedRestaurant}
          onClose={handleCloseDropdown}
          onNavigate={handleNavigate}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant}
          isOpen={showRestaurantModal}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}