import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import TabNavigation from '@/components/layout/TabNavigation';
import { useSearchRestaurants } from '@/hooks/useRestaurants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Restaurant, SearchFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';

const cuisineOptions = [
  'Mediterranean', 'Asian', 'Italian', 'Mexican', 'Indian', 'Thai', 'Japanese',
  'American', 'French', 'Middle Eastern', 'Ethiopian', 'Vietnamese', 'Korean'
];

const priceRangeOptions = ['$', '$$', '$$$', '$$$$'];

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [minVeganScore, setMinVeganScore] = useState([7]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(['$', '$$']);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState('2');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  
  const { position } = useGeolocation();
  const searchMutation = useSearchRestaurants();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!position && !searchQuery.trim()) {
      toast({
        title: 'Location or Search Required',
        description: 'Please enter a search term or enable location access.',
        variant: 'destructive',
      });
      return;
    }

    const filters: SearchFilters = {
      minVeganScore: minVeganScore[0],
      maxDistance: parseInt(maxDistance) * 1000, // Convert to meters
      priceRange: selectedPriceRanges,
      cuisineTypes: selectedCuisines,
    };

    try {
      const results = await searchMutation.mutateAsync({
        query: searchQuery.trim(),
        location: position || undefined,
        filters,
        limit: 20,
      });
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Failed to search restaurants. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinVeganScore([7]);
    setSelectedPriceRanges(['$', '$$']);
    setSelectedCuisines([]);
    setMaxDistance('2');
    setSearchResults([]);
  };

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    if (checked) {
      setSelectedPriceRanges(prev => [...prev, priceRange]);
    } else {
      setSelectedPriceRanges(prev => prev.filter(p => p !== priceRange));
    }
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      setSelectedCuisines(prev => [...prev, cuisine.toLowerCase()]);
    } else {
      setSelectedCuisines(prev => prev.filter(c => c !== cuisine.toLowerCase()));
    }
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setLocation(`/restaurant/${restaurant.id}`);
  };

  useEffect(() => {
    // Auto-search when filters change if there's a query
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(handleSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, minVeganScore, selectedPriceRanges, selectedCuisines, maxDistance]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/home')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left text-neutral-gray"></i>
            </Button>
            <h1 className="text-xl font-poppins font-semibold">Advanced Search</h1>
          </div>
          
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-gray"></i>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, cuisine, or restaurant name..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-vegan-green transition-colors font-opensans"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-poppins font-semibold mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vegan Score Filter */}
              <div>
                <Label className="block text-sm font-opensans font-medium text-gray-700 mb-2">
                  Minimum Vegan Score
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={minVeganScore}
                    onValueChange={setMinVeganScore}
                    max={10}
                    min={0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="bg-vegan-green text-white px-3 py-1 rounded-lg text-sm font-opensans font-medium min-w-[60px] text-center">
                    {minVeganScore[0].toFixed(1)}+
                  </span>
                </div>
              </div>
              
              {/* Distance Filter */}
              <div>
                <Label className="block text-sm font-opensans font-medium text-gray-700 mb-2">
                  Distance
                </Label>
                <Select value={maxDistance} onValueChange={setMaxDistance}>
                  <SelectTrigger className="w-full border-gray-200 focus:border-vegan-green">
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Within 1 km</SelectItem>
                    <SelectItem value="2">Within 2 km</SelectItem>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range */}
              <div className="md:col-span-2">
                <Label className="block text-sm font-opensans font-medium text-gray-700 mb-2">
                  Price Range
                </Label>
                <div className="flex space-x-2">
                  {priceRangeOptions.map((range) => (
                    <Button
                      key={range}
                      variant={selectedPriceRanges.includes(range) ? "default" : "outline"}
                      onClick={() => handlePriceRangeChange(range, !selectedPriceRanges.includes(range))}
                      className={`px-4 py-2 rounded-lg font-opensans font-medium ${
                        selectedPriceRanges.includes(range)
                          ? 'bg-vegan-green border-vegan-green text-white hover:bg-vegan-dark-green'
                          : 'border-gray-200 text-neutral-gray hover:border-vegan-green hover:text-vegan-green'
                      }`}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Cuisine Type */}
              <div className="md:col-span-2">
                <Label className="block text-sm font-opensans font-medium text-gray-700 mb-2">
                  Cuisine Type
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={selectedCuisines.includes(cuisine.toLowerCase())}
                        onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                        className="border-vegan-green data-[state=checked]:bg-vegan-green"
                      />
                      <Label htmlFor={cuisine} className="text-sm font-opensans cursor-pointer">
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleSearch}
                disabled={searchMutation.isPending}
                className="flex-1 bg-vegan-green text-white py-3 px-6 rounded-xl font-opensans font-medium hover:bg-vegan-dark-green transition-colors"
              >
                {searchMutation.isPending ? 'Searching...' : 'Apply Filters'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleClearFilters}
                className="px-6 py-3 border border-gray-200 text-neutral-gray rounded-xl font-opensans font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Search Results */}
        <div className="space-y-4">
          {searchResults.length === 0 && searchQuery && !searchMutation.isPending && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-neutral-gray mb-4"></i>
              <p className="text-neutral-gray font-opensans">No restaurants found matching your criteria.</p>
            </div>
          )}
          
          {searchResults.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Restaurant image placeholder */}
                  <div className="w-20 h-20 bg-vegan-light-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-utensils text-vegan-green text-2xl"></i>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-poppins font-semibold text-lg">{restaurant.name}</h3>
                      <span className={`px-3 py-1 rounded-lg text-sm font-opensans font-medium ${
                        restaurant.veganScore && parseFloat(restaurant.veganScore) >= 8
                          ? 'bg-vegan-green text-white'
                          : restaurant.veganScore && parseFloat(restaurant.veganScore) >= 6
                          ? 'bg-warning-orange text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {restaurant.veganScore ? parseFloat(restaurant.veganScore).toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    
                    <p className="text-neutral-gray text-sm mb-2">
                      {restaurant.cuisineTypes?.join(', ') || 'Cuisine not specified'} • {restaurant.priceLevel || '$$'}
                    </p>
                    <p className="text-neutral-gray text-sm mb-3">{restaurant.address}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {restaurant.rating && (
                          <span className="text-sm text-neutral-gray">
                            <i className="fas fa-star text-yellow-400 mr-1"></i>
                            {parseFloat(restaurant.rating).toFixed(1)} ({restaurant.reviewCount || 0} reviews)
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {restaurant.veganScore && parseFloat(restaurant.veganScore) >= 8 && (
                          <span className="bg-vegan-light-green text-vegan-green px-2 py-1 rounded text-xs font-opensans">
                            Highly Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <TabNavigation currentTab="search" />
    </div>
  );
}
