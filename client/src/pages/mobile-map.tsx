import { useState, useEffect } from 'react';
import { Locate, Filter, List } from 'lucide-react';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { FloatingSearchBar } from '@/components/mobile/FloatingSearchBar';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useViewportRestaurants } from '@/hooks/useRestaurants';
import Map from '@/components/map/Map';

export default function MobileMapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  
  const { position: location, getCurrentPosition, loading: locationLoading } = useGeolocation();
  const { data: restaurants, isLoading: restaurantsLoading } = useViewportRestaurants();

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const handleLocationRequest = () => {
    getCurrentPosition();
  };

  // Mock search suggestions
  const searchSuggestions = [
    {
      id: '1',
      type: 'cuisine' as const,
      title: 'Italian restaurants',
      subtitle: '12 nearby restaurants'
    },
    {
      id: '2',
      type: 'restaurant' as const,
      title: 'Green Garden',
      subtitle: 'Vegan • 0.5 km away • ⭐ 4.8'
    },
    {
      id: '3',
      type: 'recent' as const,
      title: 'Healthy food near me',
      subtitle: 'Recent search'
    }
  ];

  return (
    <div className="h-screen w-full relative bg-white overflow-hidden">
      {/* Header - transparent over map */}
      <MobileHeader
        title="VeganMap"
        showProfile={true}
        transparent={true}
        onProfile={() => console.log('Profile clicked')}
      />

      {/* Floating Search Bar */}
      <FloatingSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        suggestions={searchSuggestions}
        loading={restaurantsLoading}
        className="top-20"
      />

      {/* Map Container */}
      <div className="absolute inset-0 top-14">
        <Map
          restaurants={restaurants || []}
          isLoading={restaurantsLoading}
          userLocation={location || undefined}
          className="w-full h-full"
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3">
        {/* Location Button */}
        <Button
          onClick={handleLocationRequest}
          disabled={locationLoading}
          size="lg"
          className="h-12 w-12 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50"
          variant="outline"
        >
          {locationLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <Locate className="h-5 w-5" />
          )}
        </Button>

        {/* Filters Button */}
        <Button
          onClick={() => setShowFilters(true)}
          size="lg"
          className="h-12 w-12 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50"
          variant="outline"
        >
          <Filter className="h-5 w-5" />
        </Button>

        {/* List View Button */}
        <Button
          onClick={() => setShowList(true)}
          size="lg"
          className="h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:bg-primary/90"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Restaurant Count Badge */}
      {restaurants && restaurants.length > 0 && (
        <div className="absolute top-32 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md border border-white/20">
          <span className="text-sm font-medium text-gray-700">
            {restaurants.length} restaurants
          </span>
        </div>
      )}

      {/* Loading State */}
      {restaurantsLoading && (
        <div className="absolute inset-0 top-14 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-gray-700 font-medium">Loading restaurants...</span>
          </div>
        </div>
      )}
    </div>
  );
}