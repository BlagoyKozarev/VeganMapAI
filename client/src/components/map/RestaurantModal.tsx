import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { MapPin, Phone, Globe, Clock, Star } from 'lucide-react';
import type { Restaurant } from '@shared/schema';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RestaurantModal({ restaurant, isOpen, onClose }: RestaurantModalProps) {
  if (!restaurant) return null;

  const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
  const googleRating = restaurant.rating ? parseFloat(restaurant.rating) : 0;

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

  const formatOpeningHours = () => {
    if (!restaurant.openingHours || typeof restaurant.openingHours !== 'object') {
      return ['Hours not available'];
    }
    const openingHours = restaurant.openingHours as any;
    if (openingHours.weekday_text && Array.isArray(openingHours.weekday_text)) {
      return openingHours.weekday_text.slice(0, 3); // Show first 3 days
    }
    return ['Hours not available'];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold mb-2">
              {restaurant.name}
            </DialogTitle>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
          </div>
          <FavoriteButton restaurantId={restaurant.id} size="lg" />
        </DialogHeader>

        <div className="space-y-6">
          {/* Vegan Score Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Vegan Friendliness</h3>
                <p className="text-sm text-gray-600">AI-calculated score based on menu, staff knowledge, and policies</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVeganScoreColor(veganScore)}`}>
                  {veganScore.toFixed(1)}/10 · {getVeganScoreLabel(veganScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact & Rating */}
            <div className="space-y-3">
              {googleRating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="font-medium">{googleRating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">Google Rating</span>
                </div>
              )}
              
              {restaurant.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <a 
                    href={`tel:${restaurant.phoneNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    {restaurant.phoneNumber}
                  </a>
                </div>
              )}
              
              {restaurant.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <a 
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {restaurant.priceLevel && (
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Price:</span>
                  <span className="font-medium">
                    {'€'.repeat(parseInt(restaurant.priceLevel.toString()))}
                  </span>
                </div>
              )}
            </div>

            {/* Opening Hours */}
            <div className="space-y-3">
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <div className="font-medium text-sm">Opening Hours</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {formatOpeningHours().map((hours: string, index: number) => (
                      <div key={index}>{hours}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cuisine Types */}
          {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Cuisine Types</h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisineTypes
                  .filter(type => !['point_of_interest', 'establishment'].includes(type))
                  .slice(0, 6)
                  .map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type.replace(/_/g, ' ').toLowerCase()}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
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
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}