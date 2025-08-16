import { useState } from 'react';
import { MapPin, Star, DollarSign, Phone, Globe, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PRICE_LEVELS, type SearchResult } from '@shared/searchSchema';

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
  phone_number?: string;
  website?: string;
  distance_km?: number;
}

interface SearchResultsProps {
  results: SearchResult;
  isLoading?: boolean;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onLoadMore?: () => void;
  className?: string;
}

export function SearchResults({ 
  results, 
  isLoading = false, 
  onRestaurantClick,
  onLoadMore,
  className 
}: SearchResultsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results.items || results.items.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms to discover more vegan dining options.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  const formatDistance = (km?: number) => {
    if (!km) return null;
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  };

  const getVeganScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriceLevelDisplay = (level: number) => {
    return PRICE_LEVELS[level as keyof typeof PRICE_LEVELS] || '$';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Found {results.total} restaurants in {results.took_ms}ms</span>
        </div>
        <span>Page {results.page} of {results.pages}</span>
      </div>

      {/* Restaurant Cards */}
      <div className="space-y-3">
        {results.items.map((restaurant: Restaurant) => (
          <Card 
            key={restaurant.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedId === restaurant.id && "ring-2 ring-primary"
            )}
            onClick={() => {
              setSelectedId(restaurant.id);
              onRestaurantClick?.(restaurant);
            }}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Restaurant Name and Score */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-1 truncate">
                      {restaurant.name}
                    </h3>
                    {restaurant.address && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    {restaurant.distance_km && (
                      <Badge variant="outline" className="text-xs">
                        {formatDistance(restaurant.distance_km)}
                      </Badge>
                    )}
                    <Badge className={cn("text-xs font-medium", getVeganScoreColor(restaurant.veganScore))}>
                      <Star className="h-3 w-3 mr-1" />
                      {restaurant.veganScore.toFixed(1)}
                    </Badge>
                  </div>
                </div>

                {/* Cuisine Types */}
                {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {restaurant.cuisineTypes.slice(0, 3).map((cuisine) => (
                      <Badge key={cuisine} variant="secondary" className="text-xs capitalize">
                        {cuisine.replace('-', ' ')}
                      </Badge>
                    ))}
                    {restaurant.cuisineTypes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{restaurant.cuisineTypes.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <Separator />

                {/* Restaurant Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Price Level */}
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {getPriceLevelDisplay(restaurant.priceLevel)}
                      </span>
                    </div>

                    {/* Rating */}
                    {restaurant.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="flex items-center gap-2">
                      {restaurant.phone_number && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${restaurant.phone_number}`, '_blank');
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {restaurant.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(restaurant.website, '_blank');
                          }}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* View Details Arrow */}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {results.page < results.pages && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={isLoading}
          >
            Load More Results
          </Button>
        </div>
      )}

      {/* Facets Display */}
      {results.facets && (
        <div className="mt-8 space-y-6 pt-6 border-t">
          {/* Top Cuisines */}
          {results.facets.cuisines && results.facets.cuisines.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Popular Cuisines in Results</h4>
              <div className="flex flex-wrap gap-2">
                {results.facets.cuisines.map((cuisine: any) => (
                  <Badge key={cuisine.name} variant="outline" className="text-xs">
                    {cuisine.name.charAt(0).toUpperCase() + cuisine.name.slice(1)} ({cuisine.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price Distribution */}
          {results.facets.priceRanges && results.facets.priceRanges.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Price Distribution</h4>
              <div className="flex gap-2">
                {results.facets.priceRanges.map((price: any) => (
                  <Badge key={price.level} variant="outline" className="text-xs">
                    {getPriceLevelDisplay(price.level)} ({price.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}