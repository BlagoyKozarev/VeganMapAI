import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { MapPin, Star, Phone, Globe } from 'lucide-react';

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

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to profile if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading your favorites...</div>
        </div>
      </div>
    );
  }

  const getVeganScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-50';
    if (score >= 7.0) return 'text-green-500 bg-green-50';
    if (score >= 5.5) return 'text-yellow-600 bg-yellow-50';
    if (score >= 4.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getVeganScoreLabel = (score: number) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.0) return 'Very Good';
    if (score >= 5.5) return 'Good';
    if (score >= 4.0) return 'Fair';
    return 'Limited';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3 h-16">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/profile')}
            className="p-2 mr-3 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">←</span>
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-semibold">My Favorites</h1>
            <p className="text-sm text-gray-600">{favorites.length} saved restaurants</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Start exploring restaurants and save your favorites!</p>
            <Button onClick={() => setLocation('/')} className="bg-green-600 hover:bg-green-700">
              Explore Restaurants
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {favorites.map((restaurant: Restaurant) => {
              const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
              
              return (
                <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-xl">{restaurant.name}</h3>
                          <FavoriteButton restaurantId={restaurant.id} size="md" />
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{restaurant.address}</span>
                        </div>

                        {/* Scores */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVeganScoreColor(veganScore)}`}>
                            Vegan Score: {veganScore.toFixed(1)}/10 · {getVeganScoreLabel(veganScore)}
                          </div>
                          
                          {restaurant.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{restaurant.rating}/5</span>
                              <span className="text-gray-500 text-sm ml-1">Google</span>
                            </div>
                          )}
                          
                          {restaurant.priceLevel && (
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-1">Price:</span>
                              <span className="text-sm font-medium">
                                {'€'.repeat(parseInt(restaurant.priceLevel))}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center space-x-4 mb-3">
                          {restaurant.phoneNumber && (
                            <a 
                              href={`tel:${restaurant.phoneNumber}`}
                              className="flex items-center text-blue-600 hover:underline text-sm"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              {restaurant.phoneNumber}
                            </a>
                          )}
                          
                          {restaurant.website && (
                            <a 
                              href={restaurant.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline text-sm"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Website
                            </a>
                          )}
                        </div>

                        {/* Cuisine Types */}
                        {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {restaurant.cuisineTypes
                              .filter(type => !['point_of_interest', 'establishment'].includes(type))
                              .slice(0, 4)
                              .map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type.replace(/_/g, ' ').toLowerCase()}
                                </Badge>
                              ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setLocation(`/?restaurant=${restaurant.id}`)}
                            className="flex-1"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={() => {
                              const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                            }}
                            className="flex-1"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Directions
                          </Button>
                          
                          {restaurant.phoneNumber && (
                            <Button 
                              variant="outline"
                              onClick={() => window.open(`tel:${restaurant.phoneNumber}`, '_self')}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}