import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Eye, Star, Utensils, X } from 'lucide-react';
import type { Restaurant } from '@shared/schema';

interface RestaurantDropdownProps {
  restaurant: Restaurant;
  onClose: () => void;
  onNavigate: () => void;
  onViewDetails: () => void;
}

export function RestaurantDropdown({ 
  restaurant, 
  onClose, 
  onNavigate, 
  onViewDetails 
}: RestaurantDropdownProps) {
  const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
  const googleRating = restaurant.rating ? parseFloat(restaurant.rating) : 0;

  const getVeganScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-600';
    if (score >= 7.0) return 'bg-green-500';
    if (score >= 5.5) return 'bg-yellow-500';
    if (score >= 4.0) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      {/* Backdrop to close dropdown */}
      <div 
        className="fixed inset-0 z-[999]" 
        onClick={onClose}
      />
      
      {/* Bottom Footer Menu */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-4 z-[1000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {restaurant.name}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{restaurant.address}</span>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scores Section */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Vegan Score */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Utensils className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium text-gray-600">Vegan Score</span>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded text-white text-sm font-bold ${getVeganScoreColor(veganScore)}`}>
              {veganScore > 0 ? veganScore.toFixed(1) : '?'}/10
            </div>
          </div>

          {/* Google Maps Score */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium text-gray-600">Maps Score</span>
            </div>
            <div className="inline-flex items-center px-2 py-1 rounded bg-blue-500 text-white text-sm font-bold">
              {googleRating > 0 ? googleRating.toFixed(1) : '?'}/5
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={onNavigate}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
          >
            <Navigation className="h-5 w-5 mr-2" />
            Навигирай
          </Button>
          
          <Button 
            onClick={onViewDetails}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
          >
            <Eye className="h-5 w-5 mr-2" />
            Разгледай
          </Button>
        </div>
      </div>
    </>
  );
}