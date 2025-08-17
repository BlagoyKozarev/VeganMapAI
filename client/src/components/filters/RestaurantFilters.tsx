import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, SlidersHorizontal } from 'lucide-react';

interface RestaurantFiltersProps {
  restaurants: any[];
  onFiltersChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export interface FilterOptions {
  cuisineType: string;
  minVeganScore: number;
  priceLevel: string;
  maxDistance: number;
}

export function RestaurantFilters({ 
  restaurants, 
  onFiltersChange, 
  onClose,
  isMobile = false 
}: RestaurantFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    cuisineType: 'all',
    minVeganScore: 0,
    priceLevel: 'all',
    maxDistance: 500 // Increased to show all restaurants in Bulgaria
  });

  // Extract unique cuisine types from restaurants
  const cuisineTypes = Array.from(new Set(
    restaurants.flatMap(r => r.cuisineTypes || [])
      .filter(cuisine => cuisine && cuisine !== 'establishment' && cuisine !== 'point_of_interest' && cuisine !== 'food')
  )).sort();

  // Update parent whenever filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleReset = () => {
    const resetFilters = {
      cuisineType: 'all',
      minVeganScore: 0,
      priceLevel: 'all',
      maxDistance: 500
    };
    setFilters(resetFilters);
  };

  const containerClass = isMobile 
    ? "space-y-6 p-4" 
    : "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 w-64";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <SlidersHorizontal className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cuisine Type Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Cuisine Type</Label>
        <Select 
          value={filters.cuisineType} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, cuisineType: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {cuisineTypes.map(cuisine => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vegan Score Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Minimum Vegan Score: {filters.minVeganScore} ⭐
        </Label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minVeganScore}
          onChange={(e) => setFilters(prev => ({ ...prev, minVeganScore: parseFloat(e.target.value) }))}
          className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 ⭐</span>
          <span>2.5 ⭐</span>
          <span>5 ⭐</span>
        </div>
      </div>

      {/* Price Level Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Price Level</Label>
        <div className="grid grid-cols-5 gap-1">
          <Button
            variant={filters.priceLevel === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, priceLevel: 'all' }))}
            className="text-xs px-2 py-1"
          >
            All
          </Button>
          {[1, 2, 3, 4].map(level => (
            <Button
              key={level}
              variant={filters.priceLevel === level.toString() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, priceLevel: level.toString() }))}
              className="text-xs px-2 py-1"
            >
              {'$'.repeat(level)}
            </Button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Max Distance: {filters.maxDistance} km
        </Label>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={filters.maxDistance}
          onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
          className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 km</span>
          <span>25 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button
        onClick={handleReset}
        variant="outline"
        className="w-full mt-4"
      >
        Clear Filters
      </Button>
    </div>
  );
}