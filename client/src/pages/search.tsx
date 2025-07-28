import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  phoneNumber?: string;
  website?: string;
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'vegan' | 'google' | 'name'>('vegan');

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['/api/restaurants/all-available'],
  });

  // Define food-related cuisine types only
  const foodRelatedTypes = [
    'bakery', 'bar', 'cafe', 'meal_delivery', 'meal_takeaway', 
    'night_club', 'restaurant', 'food', 'pizza', 'fast_food',
    'italian', 'chinese', 'japanese', 'indian', 'mexican',
    'thai', 'french', 'greek', 'mediterranean', 'vegetarian',
    'vegan', 'asian', 'european', 'american', 'seafood',
    'steakhouse', 'sushi', 'buffet', 'barbecue', 'breakfast',
    'brunch', 'lunch', 'dinner', 'dessert', 'ice_cream'
  ];

  // Get unique cuisines for filter - only food-related
  const allCuisines = Array.from(
    new Set(
      (restaurants as Restaurant[]).flatMap((r: Restaurant) => 
        r.cuisineTypes?.filter(type => 
          foodRelatedTypes.includes(type.toLowerCase())
        ) || []
      )
    )
  ).slice(0, 12); // Show top 12 food-related cuisine types

  // Filter and sort restaurants
  const filteredRestaurants = (restaurants as Restaurant[])
    .filter((restaurant: Restaurant) => {
      // Text search
      if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Cuisine filter
      if (selectedCuisines.length > 0) {
        const hasSelectedCuisine = selectedCuisines.some(cuisine => 
          restaurant.cuisineTypes?.includes(cuisine)
        );
        if (!hasSelectedCuisine) return false;
      }

      // Price filter
      if (priceFilter !== 'all') {
        const price = restaurant.priceLevel;
        if (priceFilter === 'budget' && (!price || parseInt(price) > 2)) return false;
        if (priceFilter === 'mid' && (!price || parseInt(price) < 2 || parseInt(price) > 3)) return false;
        if (priceFilter === 'expensive' && (!price || parseInt(price) < 4)) return false;
      }

      return true;
    })
    .sort((a: Restaurant, b: Restaurant) => {
      if (sortBy === 'vegan') {
        const aScore = a.veganScore ? parseFloat(a.veganScore) : 0;
        const bScore = b.veganScore ? parseFloat(b.veganScore) : 0;
        return bScore - aScore;
      }
      if (sortBy === 'google') {
        const aRating = a.rating ? parseFloat(a.rating) : 0;
        const bRating = b.rating ? parseFloat(b.rating) : 0;
        return bRating - aRating;
      }
      return a.name.localeCompare(b.name);
    });

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisines([]);
    setPriceFilter('all');
    setSortBy('vegan');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3 h-16">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="p-2 mr-3 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">←</span>
          </Button>
          
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search restaurants by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <div className="w-80 p-4 bg-white h-screen overflow-y-auto">
          <div className="space-y-6">
            {/* Sort Options */}
            <div>
              <h3 className="font-medium mb-3">Sort by</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={sortBy === 'vegan'}
                    onChange={() => setSortBy('vegan')}
                    className="mr-2"
                  />
                  Vegan Score
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={sortBy === 'google'}
                    onChange={() => setSortBy('google')}
                    className="mr-2"
                  />
                  Google Rating
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={sortBy === 'name'}
                    onChange={() => setSortBy('name')}
                    className="mr-2"
                  />
                  Name (A-Z)
                </label>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={priceFilter === 'all'}
                    onChange={() => setPriceFilter('all')}
                    className="mr-2"
                  />
                  All Prices
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={priceFilter === 'budget'}
                    onChange={() => setPriceFilter('budget')}
                    className="mr-2"
                  />
                  Budget (€-€€)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={priceFilter === 'mid'}
                    onChange={() => setPriceFilter('mid')}
                    className="mr-2"
                  />
                  Mid-range (€€-€€€)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={priceFilter === 'expensive'}
                    onChange={() => setPriceFilter('expensive')}
                    className="mr-2"
                  />
                  Fine Dining (€€€€+)
                </label>
              </div>
            </div>

            {/* Cuisine Types */}
            <div>
              <h3 className="font-medium mb-3">Cuisine Types</h3>
              <div className="flex flex-wrap gap-2">
                {allCuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={selectedCuisines.includes(cuisine) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCuisine(cuisine)}
                  >
                    {cuisine.replace(/_/g, ' ').toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button 
              onClick={clearFilters}
              variant="outline" 
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {filteredRestaurants.length} restaurants found
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading restaurants...</div>
          ) : (
            <div className="grid gap-4">
              {filteredRestaurants.map((restaurant: Restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-green-600">
                              Vegan Score: {restaurant.veganScore || 'N/A'}/10
                            </span>
                          </div>
                          {restaurant.rating && (
                            <div className="flex items-center">
                              <span className="text-sm text-yellow-600">
                                ⭐ {restaurant.rating}/5
                              </span>
                            </div>
                          )}
                          {restaurant.priceLevel && (
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500">
                                {'€'.repeat(parseInt(restaurant.priceLevel))}
                              </span>
                            </div>
                          )}
                        </div>

                        {restaurant.cuisineTypes && (
                          <div className="flex flex-wrap gap-1">
                            {restaurant.cuisineTypes
                              .filter(type => foodRelatedTypes.includes(type.toLowerCase()))
                              .slice(0, 3)
                              .map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type.replace(/_/g, ' ').toLowerCase()}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <Button
                          onClick={() => setLocation(`/?restaurant=${restaurant.id}`)}
                          size="sm"
                        >
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}