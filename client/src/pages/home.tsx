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
      {/* Header with Icons and Search */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          {/* Top Row - Logo and Icons */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-poppins font-bold text-vegan-green">VeganMapAI</h1>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/ai-chat')}
                className="p-2 hover:bg-vegan-light-green rounded-full transition-colors"
                title="AI Assistant"
              >
                <i className="fas fa-microphone text-vegan-green text-lg"></i>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/profile')}
                className="p-2 hover:bg-vegan-light-green rounded-full transition-colors"
                title="Profile"
              >
                <i className="fas fa-user text-vegan-green text-lg"></i>
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>

      {/* Map Container */}
      <div className="h-screen relative">
        <div className="absolute inset-0" style={{ marginTop: '120px' }}>
          <Map
            center={position ? [position.lat, position.lng] : [42.7, 23.16]}
            restaurants={restaurants}
            onRestaurantClick={handleRestaurantClick}
            loading={restaurantsLoading}
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={handleCurrentLocation}
        className="absolute bottom-24 right-4 w-14 h-14 bg-vegan-green rounded-full shadow-lg flex items-center justify-center text-white hover:bg-vegan-dark-green transition-colors z-30 p-0"
        disabled={loading}
      >
        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-location-arrow'} text-xl`}></i>
      </Button>

      {/* Action Menu */}
      {showActionMenu && selectedRestaurant && (
        <ActionMenu
          restaurant={selectedRestaurant}
          onClose={handleCloseActionMenu}
        />
      )}

      {/* Bottom Tab Navigation */}
      <TabNavigation currentTab="map" />
    </div>
  );
}
