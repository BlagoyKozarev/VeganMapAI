import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import TabNavigation from '@/components/layout/TabNavigation';
import { useFavoriteRestaurant, useUnfavoriteRestaurant, useAddVisit } from '@/hooks/useRestaurants';
import { Restaurant, VeganScoreBreakdown, PersonalMatch } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface RestaurantDetailResponse {
  restaurant: Restaurant;
  scoreBreakdown: VeganScoreBreakdown;
  isFavorite: boolean;
  personalMatch: PersonalMatch;
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<RestaurantDetailResponse>({
    queryKey: ['/api/restaurants', id],
    enabled: !!id,
  });

  const favoriteMutation = useFavoriteRestaurant();
  const unfavoriteMutation = useUnfavoriteRestaurant();
  const visitMutation = useAddVisit();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vegan-green rounded-2xl mb-4 animate-pulse">
            <i className="fas fa-utensils text-white text-2xl"></i>
          </div>
          <p className="text-neutral-gray font-opensans">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-poppins font-semibold mb-2">Restaurant Not Found</h2>
          <p className="text-neutral-gray font-opensans mb-6">
            The restaurant you're looking for could not be found.
          </p>
          <Button 
            onClick={() => setLocation('/home')}
            className="bg-vegan-green hover:bg-vegan-dark-green text-white"
          >
            Back to Map
          </Button>
        </div>
      </div>
    );
  }

  const { restaurant, scoreBreakdown, isFavorite, personalMatch } = data;

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      unfavoriteMutation.mutate(restaurant.id);
    } else {
      favoriteMutation.mutate(restaurant.id);
    }
  };

  const handleVisit = () => {
    visitMutation.mutate({
      restaurantId: restaurant.id,
    });
  };

  const handleReservation = () => {
    if (restaurant.website) {
      window.open(restaurant.website, '_blank');
    } else {
      toast({
        title: 'Website Not Available',
        description: 'This restaurant does not have a website link available.',
        variant: 'destructive',
      });
    }
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'bg-vegan-green';
    if (numScore >= 6) return 'bg-warning-orange';
    return 'bg-gray-400';
  };

  const getScoreLabel = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'Excellent';
    if (numScore >= 6) return 'Good';
    if (numScore >= 4) return 'Fair';
    return 'Limited';
  };

  const formatScoreCategory = (key: string) => {
    const mapping: { [key: string]: string } = {
      menuVariety: 'Menu Variety',
      ingredientClarity: 'Ingredient Clarity',
      staffKnowledge: 'Staff Knowledge',
      crossContaminationPrevention: 'Cross-contamination Prevention',
      nutritionalInformation: 'Nutritional Information',
      allergenManagement: 'Allergen Management',
    };
    return mapping[key] || key;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost"
              onClick={() => setLocation('/home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left text-neutral-gray"></i>
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="ghost"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-share text-neutral-gray"></i>
              </Button>
              <Button 
                variant="ghost"
                onClick={handleFavoriteToggle}
                disabled={favoriteMutation.isPending || unfavoriteMutation.isPending}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className={`${isFavorite ? 'fas' : 'far'} fa-heart ${isFavorite ? 'text-red-500' : 'text-neutral-gray'}`}></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Restaurant Header */}
        <div className="px-4 py-6">
          {/* Restaurant image placeholder */}
          <div className="w-full h-64 bg-gradient-to-r from-vegan-light-green to-green-100 rounded-2xl mb-6 flex items-center justify-center">
            <i className="fas fa-utensils text-vegan-green text-6xl"></i>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-poppins font-bold mb-2">{restaurant.name}</h1>
              <p className="text-neutral-gray mb-2">
                {restaurant.cuisineTypes?.join(', ') || 'Cuisine not specified'} • {restaurant.priceLevel || '$$'}
              </p>
              <p className="text-neutral-gray">{restaurant.address}</p>
            </div>
            <div className="text-right">
              <div className={`${getScoreColor(restaurant.veganScore || '0')} text-white text-2xl font-poppins font-bold rounded-2xl px-4 py-2 mb-2`}>
                {restaurant.veganScore ? parseFloat(restaurant.veganScore).toFixed(1) : 'N/A'}
              </div>
              <p className="text-sm text-vegan-green font-opensans font-medium">
                {restaurant.veganScore ? getScoreLabel(restaurant.veganScore) : 'Not Rated'}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-6 text-sm text-neutral-gray mb-6">
            {restaurant.rating && (
              <span>
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                {parseFloat(restaurant.rating).toFixed(1)} ({restaurant.reviewCount || 0} reviews)
              </span>
            )}
            <span><i className="fas fa-map-marker-alt mr-1"></i>Restaurant location</span>
            <span><i className="fas fa-clock mr-1"></i>Hours not available</span>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button 
              onClick={handleReservation}
              className="bg-vegan-green text-white py-4 px-6 rounded-xl font-opensans font-medium hover:bg-vegan-dark-green transition-colors h-auto"
            >
              <i className="fas fa-calendar mr-2"></i>Visit Website
            </Button>
            <Button 
              onClick={handleDirections}
              className="bg-blue-500 text-white py-4 px-6 rounded-xl font-opensans font-medium hover:bg-blue-600 transition-colors h-auto"
            >
              <i className="fas fa-directions mr-2"></i>Get Directions
            </Button>
          </div>

          {/* Mark as Visited Button */}
          <Button
            onClick={handleVisit}
            disabled={visitMutation.isPending}
            variant="outline"
            className="w-full py-3 mb-8 border-vegan-green text-vegan-green hover:bg-vegan-light-green"
          >
            <i className="fas fa-check mr-2"></i>
            {visitMutation.isPending ? 'Recording Visit...' : 'Mark as Visited'}
          </Button>
        </div>
        
        {/* Vegan Score Breakdown */}
        {scoreBreakdown && (
          <div className="px-4 mb-8">
            <h2 className="text-xl font-poppins font-semibold mb-4">Vegan Score Breakdown</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(scoreBreakdown)
                    .filter(([key]) => !['id', 'restaurantId', 'overallScore', 'lastUpdated'].includes(key))
                    .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-opensans font-medium">{formatScoreCategory(key)}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`${getScoreColor(value)} h-2 rounded-full`}
                            style={{ width: `${(parseFloat(value) / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-opensans font-medium min-w-[30px]">
                          {parseFloat(value).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Personal Match */}
        {personalMatch && (
          <div className="px-4 mb-8">
            <h2 className="text-xl font-poppins font-semibold mb-4">Personal Match</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="bg-vegan-light-green p-4 text-center">
                  <div className="text-2xl font-poppins font-bold text-vegan-green mb-1">
                    {personalMatch.tasteMatch}%
                  </div>
                  <p className="text-sm font-opensans text-gray-700">Taste Match</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-poppins font-bold text-blue-600 mb-1">
                    {personalMatch.healthFit}%
                  </div>
                  <p className="text-sm font-opensans text-gray-700">Health Fit</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Allergen Check */}
        <div className="px-4 mb-8">
          <h2 className="text-xl font-poppins font-semibold mb-4">Allergen Check</h2>
          <Card>
            <CardContent className="bg-green-50 border border-green-200 p-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                <span className="font-opensans font-medium text-green-700">
                  Based on your profile preferences
                </span>
              </div>
              <p className="text-sm text-green-600 ml-8">
                This restaurant's allergen management score suggests it can accommodate dietary restrictions well.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Restaurant Info */}
        <div className="px-4 mb-20">
          <h2 className="text-xl font-poppins font-semibold mb-4">Restaurant Information</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              {restaurant.phoneNumber && (
                <div className="flex items-center justify-between">
                  <span className="font-opensans font-medium">Phone</span>
                  <a 
                    href={`tel:${restaurant.phoneNumber}`}
                    className="text-vegan-green font-opensans"
                  >
                    {restaurant.phoneNumber}
                  </a>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center justify-between">
                  <span className="font-opensans font-medium">Website</span>
                  <a 
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vegan-green font-opensans"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-opensans font-medium">Verified</span>
                <span className={`px-2 py-1 rounded text-xs font-opensans ${
                  restaurant.isVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {restaurant.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TabNavigation currentTab="map" />
    </div>
  );
}
