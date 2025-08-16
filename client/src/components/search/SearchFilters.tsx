import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, MapPin, DollarSign, Star, ChefHat, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { 
  COMMON_ALLERGENS, 
  COMMON_CUISINES, 
  PRICE_LEVELS, 
  DISTANCE_OPTIONS, 
  SORT_OPTIONS,
  type SearchParams 
} from '@shared/searchSchema';

interface SearchFiltersProps {
  params: SearchParams;
  onParamsChange: (params: SearchParams) => void;
  isLoading?: boolean;
  resultCount?: number;
  className?: string;
}

export function SearchFilters({ 
  params, 
  onParamsChange, 
  isLoading = false, 
  resultCount = 0,
  className 
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localParams, setLocalParams] = useState<SearchParams>(params);
  const { position: location } = useGeolocation();

  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  const updateLocalParams = (updates: Partial<SearchParams>) => {
    setLocalParams((prev: SearchParams) => ({ ...prev, ...updates }));
  };

  const handleApplyFilters = () => {
    // Automatically set user location if distance filters are used
    if ((localParams.maxDistanceKm || localParams.sort === 'distance') && location && !localParams.lat) {
      updateLocalParams({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    }
    
    onParamsChange(localParams);
    setIsOpen(false);

    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'filters_changed', {
        event_category: 'search',
        filters: Object.keys(localParams).filter(key => 
          localParams[key as keyof SearchParams] !== undefined &&
          localParams[key as keyof SearchParams] !== null &&
          localParams[key as keyof SearchParams] !== ''
        ).join(',')
      });
    }
  };

  const handleResetFilters = () => {
    const resetParams: SearchParams = {
      q: '',
      sort: 'score',
      order: 'desc',
      page: 1,
      limit: 20
    };
    setLocalParams(resetParams);
    onParamsChange(resetParams);
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localParams.q) count++;
    if (localParams.minScore !== undefined || localParams.maxScore !== undefined) count++;
    if (localParams.cuisines && localParams.cuisines.length > 0) count++;
    if (localParams.allergens && localParams.allergens.length > 0) count++;
    if (localParams.priceMin !== undefined || localParams.priceMax !== undefined) count++;
    if (localParams.maxDistanceKm) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search restaurants or cuisines..."
          value={localParams.q || ''}
          onChange={(e) => {
            updateLocalParams({ q: e.target.value });
            // Debounced search will be handled by parent component
          }}
          className="pl-10 pr-4 h-12 text-base"
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Filters Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect vegan dining experience.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* Vegan Score Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Vegan Score Range
                </Label>
                <div className="px-2">
                  <Slider
                    value={[localParams.minScore || 1, localParams.maxScore || 10]}
                    onValueChange={([min, max]) => 
                      updateLocalParams({ minScore: min, maxScore: max })
                    }
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{localParams.minScore || 1}</span>
                    <span>{localParams.maxScore || 10}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cuisines */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Cuisines
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_CUISINES.map((cuisine: string) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={localParams.cuisines?.includes(cuisine) || false}
                        onCheckedChange={(checked) => {
                          const current = localParams.cuisines || [];
                          if (checked) {
                            updateLocalParams({ cuisines: [...current, cuisine] });
                          } else {
                            updateLocalParams({ cuisines: current.filter((c: string) => c !== cuisine) });
                          }
                        }}
                      />
                      <Label htmlFor={cuisine} className="text-sm capitalize">
                        {cuisine.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Allergens to Avoid */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Avoid Allergens
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_ALLERGENS.map((allergen: string) => (
                    <div key={allergen} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergen}
                        checked={localParams.allergens?.includes(allergen) || false}
                        onCheckedChange={(checked) => {
                          const current = localParams.allergens || [];
                          if (checked) {
                            updateLocalParams({ allergens: [...current, allergen] });
                          } else {
                            updateLocalParams({ allergens: current.filter((a: string) => a !== allergen) });
                          }
                        }}
                      />
                      <Label htmlFor={allergen} className="text-sm capitalize">
                        {allergen.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PRICE_LEVELS).map(([level, symbol]) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`price-${level}`}
                        checked={
                          (localParams.priceMin || 1) <= parseInt(level) && 
                          parseInt(level) <= (localParams.priceMax || 4)
                        }
                        onCheckedChange={(checked) => {
                          const currentMin = localParams.priceMin || 1;
                          const currentMax = localParams.priceMax || 4;
                          const priceLevel = parseInt(level);
                          
                          if (checked) {
                            updateLocalParams({
                              priceMin: Math.min(currentMin, priceLevel),
                              priceMax: Math.max(currentMax, priceLevel)
                            });
                          } else {
                            // More complex logic for unchecking
                            const activeLevels = [1, 2, 3, 4].filter(l => 
                              l !== priceLevel && 
                              currentMin <= l && l <= currentMax
                            );
                            if (activeLevels.length > 0) {
                              updateLocalParams({
                                priceMin: Math.min(...activeLevels),
                                priceMax: Math.max(...activeLevels)
                              });
                            } else {
                              updateLocalParams({
                                priceMin: undefined,
                                priceMax: undefined
                              });
                            }
                          }
                        }}
                      />
                      <Label htmlFor={`price-${level}`} className="text-sm">
                        {symbol}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Distance */}
              {location && (
                <>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Maximum Distance
                    </Label>
                    <RadioGroup
                      value={localParams.maxDistanceKm?.toString() || 'all'}
                      onValueChange={(value) => 
                        updateLocalParams({ 
                          maxDistanceKm: value === 'all' ? undefined : parseInt(value),
                          lat: location.coords.latitude,
                          lng: location.coords.longitude
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="distance-all" />
                        <Label htmlFor="distance-all">All distances</Label>
                      </div>
                      {DISTANCE_OPTIONS.map((distance: number) => (
                        <div key={distance} className="flex items-center space-x-2">
                          <RadioGroupItem value={distance.toString()} id={`distance-${distance}`} />
                          <Label htmlFor={`distance-${distance}`}>Within {distance} km</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <Separator />
                </>
              )}

              {/* Sort Options */}
              <div className="space-y-3">
                <Label>Sort By</Label>
                <Select
                  value={localParams.sort}
                  onValueChange={(value: any) => updateLocalParams({ sort: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={localParams.order}
                  onValueChange={(value: any) => updateLocalParams({ order: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Highest First</SelectItem>
                    <SelectItem value="asc">Lowest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1" disabled={isLoading}>
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <span>Searching...</span>
          ) : (
            <span>{resultCount} restaurants found</span>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {localParams.q && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{localParams.q}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateLocalParams({ q: '' })}
              />
            </Badge>
          )}
          {(localParams.minScore !== undefined || localParams.maxScore !== undefined) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Score: {localParams.minScore || 1}-{localParams.maxScore || 10}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateLocalParams({ minScore: undefined, maxScore: undefined })}
              />
            </Badge>
          )}
          {localParams.cuisines && localParams.cuisines.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localParams.cuisines.length} cuisine{localParams.cuisines.length > 1 ? 's' : ''}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateLocalParams({ cuisines: undefined })}
              />
            </Badge>
          )}
          {localParams.maxDistanceKm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Within {localParams.maxDistanceKm}km
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateLocalParams({ maxDistanceKm: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}