import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import OptimizedLeafletMap from '@/components/map/OptimizedLeafletMap';
import { RestaurantModal } from '@/components/map/RestaurantModal';
import { RestaurantDropdown } from '@/components/ui/restaurant-dropdown';
import { MobileFilterDrawer } from '@/components/mobile/MobileFilterDrawer';
import { MobileAdvancedSearch } from '@/components/mobile/MobileAdvancedSearch';
import { MobileHeader } from '@/components/mobile/MobileHeaderClean';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FilterModal } from '@/components/filters/FilterModal';
import { FilterOptions } from '@/components/filters/RestaurantFilters';
import { AISearchModal } from '@/components/ai/AISearchModal';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { WelcomeOverlay } from '@/components/onboarding/WelcomeOverlay';
import { Bot, Heart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
  const { toast } = useToast();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  // Removed position state since we're using bottom footer
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);
  const [minVeganScore, setMinVeganScore] = useState(0);
  const [minGoogleScore, setMinGoogleScore] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    cuisineType: 'all',
    minVeganScore: 0,
    priceLevel: 'all',
    maxDistance: 500 // Increased to show all restaurants in Bulgaria
  });
  const [showAISearch, setShowAISearch] = useState(false);
  const [aiHighlightedRestaurants, setAiHighlightedRestaurants] = useState<Set<number>>(new Set());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isAuthenticated } = useAuth();
  // Query user favorites
  const { data: userFavorites = [] } = useQuery<any[]>({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
    retry: false
  });
  // Check URL parameters for custom location and restaurant selection
  const urlParams = new URLSearchParams(window.location.search);
  const customLat = urlParams.get('lat');
  const customLng = urlParams.get('lng');
  const restaurantId = urlParams.get('restaurant');
  // Use custom location if provided, otherwise use geolocation
  const currentPosition = customLat && customLng ? 
    { lat: parseFloat(customLat), lng: parseFloat(customLng) } : 
    position;
  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['/api/restaurants/public/map-data'],
    queryFn: async () => {
      const response = await fetch('/api/restaurants/public/map-data');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      // Handle both direct array response and wrapped response
      const restaurantData = data.restaurants || data;
      return restaurantData;
    },
  });
  // Debug loading state
  useEffect(() => {
    console.log('[HOME] Restaurants loading:', restaurantsLoading, 'count:', restaurants.length);
  }, [restaurantsLoading, restaurants.length]);
  // Handle restaurant selection from URL
  useEffect(() => {
    if (restaurants.length > 0) {
      // Handle restaurant selection from URL parameter
      if (restaurantId) {
        const targetRestaurant = restaurants.find((r: Restaurant) => r.id === restaurantId);
        if (targetRestaurant) {
          setSelectedRestaurant(targetRestaurant);
          setShowDropdown(true);
          // Clear the URL parameter to avoid re-triggering
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('restaurant');
          window.history.replaceState({}, '', newUrl.toString());
        }
      }
    }
  }, [restaurants.length, restaurantId]); // Stable dependency
  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  // Filter restaurants based on search query, scores, and comprehensive filters
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
    // Apply vegan score filter (use filters.minVeganScore if it's higher than legacy minVeganScore)
    const effectiveMinVeganScore = Math.max(minVeganScore, filters.minVeganScore);
    filtered = filtered.filter((restaurant: any) => {
      const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
      return veganScore >= effectiveMinVeganScore;
    });
    // Apply Google score filter
    filtered = filtered.filter((restaurant: any) => {
      const googleScore = restaurant.rating ? parseFloat(restaurant.rating) : 0;
      return googleScore >= minGoogleScore;
    });
    // Apply cuisine type filter
    if (filters.cuisineType !== 'all') {
      filtered = filtered.filter((restaurant: any) => 
        restaurant.cuisineTypes && restaurant.cuisineTypes.includes(filters.cuisineType)
      );
    }
    // Apply price level filter
    if (filters.priceLevel !== 'all') {
      filtered = filtered.filter((restaurant: any) => 
        restaurant.priceLevel === parseInt(filters.priceLevel)
      );
    }
    // Apply favorites filter if enabled
    if (showFavoritesOnly && userFavorites.length > 0) {
      const favoriteIds = new Set(userFavorites.map((f: any) => f.id));
      filtered = filtered.filter((restaurant: any) => favoriteIds.has(restaurant.id));
    }
    // Apply distance filter (only if we have user's position)
    if (currentPosition) {
      filtered = filtered.filter((restaurant: any) => {
        const distance = calculateDistance(
          currentPosition.lat,
          currentPosition.lng,
          parseFloat(restaurant.latitude),
          parseFloat(restaurant.longitude)
        );
        return distance <= filters.maxDistance;
      });
    } else {
    }
    // Only update if actually different to prevent loops
    if (JSON.stringify(filtered) !== JSON.stringify(filteredRestaurants)) {
      console.log('[HOME] Updating filtered restaurants:', filtered.length, 'from total:', restaurants.length);
      console.log('[HOME] First 3 filtered:', filtered.slice(0, 3).map(r => r.name));
      setFilteredRestaurants(filtered);
    }
  }, [restaurants.length, searchQuery, minVeganScore, minGoogleScore, filters, currentPosition, showFavoritesOnly, userFavorites]); // Use length instead of full array
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
      .slice(0, 15)
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
    ).slice(0, 5).map((cuisine: any) => ({
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
    toast({
      title: "Getting your location",
      description: "Finding nearby vegan restaurants...",
    });
  };
  const handleRestaurantClick = (restaurant: any, event?: any) => {
    setSelectedRestaurant({ ...restaurant, geoHash: restaurant.geoHash || null });
    setShowDropdown(true);
  };
  const handleNavigate = () => {
    if (selectedRestaurant) {
      // Enhanced mobile-compatible navigation
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}&travelmode=walking`;
      // Try multiple methods for mobile compatibility
      try {
        const opened = window.open(url, '_blank');
        if (!opened) {
          // Fallback for mobile browsers that block popups
          window.location.href = url;
        }
      } catch (error) {
        window.location.href = url;
      }
      setShowDropdown(false);
    }
  };
  const handleViewDetails = () => {
    if (selectedRestaurant) {
      setShowRestaurantModal(true);
      setShowDropdown(false);
    }
  };
  const handleAdvancedSearchOpen = () => {
    setShowAdvancedSearch(true);
  };
  const handleApplyAdvancedFilters = (advancedFilters: any) => {
    setMinVeganScore(advancedFilters.minVeganScore);
    setMinGoogleScore(advancedFilters.minGoogleScore);
    // Update main filters with advanced filter values
    setFilters(prev => ({
      ...prev,
      minVeganScore: advancedFilters.minVeganScore,
      // Add other advanced filters if needed
    }));
  };
  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };
  const handleAISearchResults = (results: any[]) => {
    // Highlight AI-suggested restaurants
    const highlightedIds = new Set(results.map(r => r.id));
    setAiHighlightedRestaurants(highlightedIds);
    // Clear search to show all restaurants with highlights
    setSearchQuery('');
    // Optionally zoom to show all AI results
    if (results.length > 0) {
      // Calculate bounds for all AI results
      const bounds: [[number, number], [number, number]] = [
        [Math.min(...results.map(r => parseFloat(r.latitude))), Math.min(...results.map(r => parseFloat(r.longitude)))],
        [Math.max(...results.map(r => parseFloat(r.latitude))), Math.max(...results.map(r => parseFloat(r.longitude)))]
      ];
      // This will be handled by the map component if it supports bounds
    }
  };
  const handleCloseModal = () => {
    setShowRestaurantModal(false);
    setSelectedRestaurant(null);
  };
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Show welcome message for first-time users
  // Removed the old welcome toast since we now have the WelcomeOverlay component
  return (
    <>
      {/* MOBILE HEADER */}
      <MobileHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSuggestions={showSuggestions}
        onShowSuggestions={setShowSuggestions}
        searchSuggestions={searchSuggestions}
        onOpenChat={() => setLocation('/ai-chat')}
        onOpenAdvancedSearch={handleAdvancedSearchOpen}
        onOpenProfile={() => setShowProfileModal(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        isAuthenticated={isAuthenticated}
      />
      <div 
        className="h-screen relative bg-gray-50"
        style={{ paddingTop: isMobile ? '64px' : '0px' }}
      >
      {/* Enhanced Google Maps Style Header - Desktop Only */}
      <div 
        className="hidden lg:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm h-16" 
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
            {/* AI Search Button - Desktop */}
            <Button
              onClick={() => setShowAISearch(true)}
              variant="outline"
              className="hidden sm:flex bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 mr-2"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Restaurant Search
            </Button>
            {/* Filter Button - Desktop */}
            <div className="relative hidden sm:block mr-2">
              <FilterModal
                restaurants={restaurants}
                filteredCount={filteredRestaurants.length}
                totalCount={restaurants.length}
                onFiltersChange={setFilters}
              />
            </div>
            <a href="/admin" className="hidden sm:block">
              <Button 
                variant="ghost" 
                className="w-9 h-9 sm:w-10 sm:h-10 p-0 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                title="Admin Panel - Manage platform settings"
              >
                <span className="text-white text-sm sm:text-lg">⚙️</span>
              </Button>
            </a>
            <a href="/ai-chat">
              <Button 
                variant="ghost" 
                className="w-9 h-9 sm:w-10 sm:h-10 p-0 hover:scale-105 transition-all duration-200"
                title="AI Voice Assistant - Ask questions about restaurants"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
              </Button>
            </a>
            <Button 
              onClick={() => setShowProfileModal(true)}
              variant="ghost" 
              className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center p-0 hover:scale-105"
              title="My Profile - View favorites and preferences"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-lg">
                <i className="fas fa-user"></i>
              </div>
            </Button>
            {isAuthenticated && (
              <Button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                variant={showFavoritesOnly ? "default" : "ghost"}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 flex items-center justify-center p-0 hover:scale-105 ${
                  showFavoritesOnly ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-gray-100'
                }`}
                title={showFavoritesOnly ? "Show all restaurants" : "Show favorites only"}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  showFavoritesOnly ? '' : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                }`}>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={showFavoritesOnly ? "currentColor" : "none"} />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Simple Map Container */}
      <div className="w-full h-full relative" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <OptimizedLeafletMap
          center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [42.6977, 23.3219]}
          zoom={11}
          restaurants={filteredRestaurants.map(r => ({
            ...r,
            latitude: parseFloat(r.latitude),
            longitude: parseFloat(r.longitude),
            veganScore: r.veganScore || '0'
          }))}
          onRestaurantClick={(restaurant) => {
            // Convert back to original format for compatibility
            const originalRestaurant = filteredRestaurants.find(r => r.id === restaurant.id);
            if (originalRestaurant) {
              handleRestaurantClick(originalRestaurant);
            }
          }}
          searchQuery={searchQuery}
          userFavorites={userFavorites.map((f: any) => f.id)}
          aiHighlightedRestaurants={aiHighlightedRestaurants}
          isAuthenticated={isAuthenticated}
        />
        {/* Mobile Panels */}
        {isMobile && (
          <>
            {/* Vegan Score Legend - Mobile */}
            <div 
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-44"
              style={{ 
                zIndex: showDropdown ? 1 : 50,
                opacity: showDropdown ? 0.7 : 1
              }}
            >
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
              {/* Mobile Location Button */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <Button
                  onClick={handleCurrentLocation}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-1.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-xs font-medium active:scale-95"
                  disabled={loading}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="mr-1">📍</span>
                  {loading ? 'Finding your location...' : 'My Location'}
                </Button>
              </div>
            </div>
            {/* Mobile Filter Controls - Top Right under Legend */}
            <div className="absolute top-72 right-4 z-[40]">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-44 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">🎚️</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">Filters</h3>
                </div>
                <div className="space-y-3">
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
                      className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                      style={{ touchAction: 'manipulation' }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
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
                      className="w-full h-2 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                      style={{ touchAction: 'manipulation' }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>2.5</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
            {loading ? 'Finding your location...' : 'My Location'}
          </Button>
        </div>
      </div>
      {/* Enhanced Filter Controls - Desktop Only */}
      <div className="hidden sm:block fixed bottom-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 w-52 transition-all duration-300 hover:shadow-xl" 
           style={{ 
             zIndex: showDropdown ? 1 : 998,
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
                background: `linear-gradient(to right, #fecaca 0%, #fde68a 50%, #bbf7d0 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
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
                background: `linear-gradient(to right, #fecaca 0%, #bbf7d0 100%)`
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
          restaurant={{ ...selectedRestaurant, geoHash: null }}
          onClose={handleCloseDropdown}
          onNavigate={handleNavigate}
          onViewDetails={handleViewDetails}
        />
      )}
      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={{ ...selectedRestaurant, geoHash: null }}
          isOpen={showRestaurantModal}
          onClose={handleCloseModal}
        />
      )}
      {/* Mobile Advanced Search */}
      <MobileAdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        initialFilters={{
          minVeganScore,
          minGoogleScore,
          maxDistance: 10,
          priceRange: [],
          cuisineTypes: [],
          allergies: [],
        }}
      />
      {/* Mobile Filter Drawer Button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-[999]">
          <MobileFilterDrawer
            restaurants={restaurants}
            filteredCount={filteredRestaurants.length}
            totalCount={restaurants.length}
            onFiltersChange={setFilters}
          />
        </div>
      )}
      {/* Mobile AI Search Button */}
      {isMobile && (
        <div className="fixed bottom-40 right-4 z-[999]">
          <Button
            onClick={() => setShowAISearch(true)}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Bot className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
      {/* AI Search Modal */}
      <AISearchModal
        isOpen={showAISearch}
        onClose={() => setShowAISearch(false)}
        onSearchResults={handleAISearchResults}
      />
      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onShowFavorites={() => {
          setShowFavoritesOnly(true);
          setShowProfileModal(false);
        }}
      />
      {/* Welcome Overlay - Temporarily disabled for mobile debugging */}
      {/* <WelcomeOverlay
        onGetStarted={() => {
          // Could trigger a guided tour in the future
          toast({
            title: "Welcome aboard! 🌱",
            description: "Start exploring vegan-friendly restaurants on the map or try AI search!",
            duration: 3000,
          });
        }}
        onSkip={() => {
          // User skipped the welcome overlay
        }}
      /> */}
      </div>
    </>
  );
}