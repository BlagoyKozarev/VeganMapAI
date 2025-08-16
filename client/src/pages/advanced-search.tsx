import { useState } from 'react';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  veganScore: number;
  priceLevel: number;
  cuisineTypes: string[];
  address?: string;
  rating?: number;
  distance_km?: number;
}

export default function AdvancedSearch() {
  const [, setLocation] = useLocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { searchParams, updateSearchParams } = useSearchParams();
  const { data, isLoading, error, loadMore, hasNextPage } = useAdvancedSearch(searchParams);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const goToMap = () => {
    if (selectedRestaurant) {
      // Navigate to map with selected restaurant
      setLocation(`/?lat=${selectedRestaurant.lat}&lng=${selectedRestaurant.lng}&zoom=16&selected=${selectedRestaurant.id}`);
    } else {
      setLocation('/');
    }
  };

  const goBack = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="Advanced Search"
        showBack
        onBack={goBack}
        rightAction={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToMap}
            className="flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" />
            Map
          </Button>
        }
      />

      <div className="pb-16 pt-2"> {/* Account for tab bar */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Search & Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchFilters
                    params={searchParams}
                    onParamsChange={updateSearchParams}
                    isLoading={isLoading}
                    resultCount={data?.total || 0}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {error && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                      <p className="font-medium">Search Error</p>
                      <p className="text-sm mt-1">
                        {error instanceof Error ? error.message : 'Something went wrong'}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-3"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data && (
                <SearchResults
                  results={data}
                  isLoading={isLoading}
                  onRestaurantClick={handleRestaurantClick}
                  onLoadMore={hasNextPage ? loadMore : undefined}
                />
              )}

              {!data && !isLoading && !error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
                      <p className="text-muted-foreground">
                        Use the filters to discover vegan restaurants that match your preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}