import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyRestaurants } from '@/hooks/useRestaurants';
import Map from '@/components/map/Map';
import SearchBar from '@/components/ui/search-bar';
import ActionMenu from '@/components/ui/action-menu';
import TabNavigation from '@/components/layout/TabNavigation';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [, setLocation] = useLocation();
  const { position, error, loading, getCurrentPosition } = useGeolocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const { toast } = useToast();

  const { 
    data: restaurants = [], 
    isLoading: restaurantsLoading,
    error: restaurantsError 
  } = useNearbyRestaurants(position, 2);

  // Debug logging
  useEffect(() => {
    console.log('Home component - restaurants count:', restaurants.length);
    if (restaurants.length > 0) {
      console.log('Sample restaurant scores:', restaurants.map((r: any) => ({ name: r.name, score: r.veganScore })));
    }
  }, [restaurants]);

  // Debug action menu state
  useEffect(() => {
    console.log('Action menu state changed:', { showActionMenu, selectedRestaurant: selectedRestaurant?.name });
  }, [showActionMenu, selectedRestaurant]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Location Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (restaurantsError) {
      toast({
        title: 'Error Loading Restaurants',
        description: 'Failed to load nearby restaurants. Please try again.',
        variant: 'destructive',
      });
    }
  }, [restaurantsError, toast]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log('Restaurant clicked:', restaurant.name);
    console.log('Setting selectedRestaurant and showActionMenu to true');
    setSelectedRestaurant(restaurant);
    setShowActionMenu(true);
    console.log('State after setting:', { showActionMenu: true, selectedRestaurant: restaurant?.name });
  };

  const handleCloseActionMenu = () => {
    setShowActionMenu(false);
    setSelectedRestaurant(null);
  };

  const handleCurrentLocation = async () => {
    try {
      await getCurrentPosition();
      toast({
        title: 'Location Updated',
        description: 'Your location has been updated.',
      });
    } catch (error) {
      // Error already handled in useGeolocation
    }
  };

  if (loading && !position) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vegan-green rounded-2xl mb-4 animate-pulse">
            <i className="fas fa-map-marker-alt text-white text-2xl"></i>
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
    <div className="relative min-h-screen bg-white">
      {/* Google Maps Style Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
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
              onClick={() => setLocation('/ai-chat')}
              className="w-10 h-10 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              title="AI Assistant"
            >
              <i className="fas fa-microphone text-gray-600 text-lg"></i>
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
      <div className="h-screen relative">
        <div className="absolute inset-0" style={{ marginTop: '75px' }}>
          <Map
            center={position ? [position.lat, position.lng] : [42.7, 23.16]}
            restaurants={restaurants}
            onRestaurantClick={handleRestaurantClick}
            loading={restaurantsLoading}
          />
        </div>
      </div>

      {/* Vegan Score Legend - Top Right */}
      <div className="absolute top-20 right-4 z-30 bg-white border border-gray-300 rounded-lg shadow-md p-3 max-w-xs">
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
      </div>

      {/* Google Maps Style Controls - Bottom Right */}
      <div className="absolute bottom-32 right-4 z-30 flex flex-col space-y-2">
        {/* Zoom Controls */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <Button
            variant="ghost"
            className="w-12 h-12 border-b border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 p-0"
          >
            <i className="fas fa-plus text-lg"></i>
          </Button>
          <Button
            variant="ghost"
            className="w-12 h-12 hover:bg-gray-50 flex items-center justify-center text-gray-600 p-0"
          >
            <i className="fas fa-minus text-lg"></i>
          </Button>
        </div>
        
        {/* My Location Button */}
        <Button
          onClick={handleCurrentLocation}
          className="w-12 h-12 bg-white border border-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors p-0"
          disabled={loading}
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-crosshairs'} text-lg`}></i>
        </Button>
      </div>



      {/* Action Menu */}
      {showActionMenu && selectedRestaurant && (
        <ActionMenu
          restaurant={selectedRestaurant as any}
          onClose={handleCloseActionMenu}
        />
      )}

      {/* Bottom Tab Navigation */}
      <TabNavigation currentTab="map" />
    </div>
  );
}
