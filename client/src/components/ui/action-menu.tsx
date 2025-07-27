import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ScoreBadge from './score-badge';
import { useFavoriteRestaurant, useUnfavoriteRestaurant } from '@/hooks/useRestaurants';
import { Restaurant } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ActionMenuProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function ActionMenu({ restaurant, onClose }: ActionMenuProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const favoriteMutation = useFavoriteRestaurant();
  const unfavoriteMutation = useUnfavoriteRestaurant();

  const handleViewDetails = () => {
    setLocation(`/restaurant/${restaurant.id}`);
    onClose();
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    onClose();
  };

  const handleReserve = () => {
    if (restaurant.website) {
      window.open(restaurant.website, '_blank');
    } else {
      toast({
        title: 'No Website Available',
        description: 'This restaurant does not have a website for reservations.',
        variant: 'destructive',
      });
    }
    onClose();
  };

  const handleOrder = () => {
    // This would typically open a delivery platform or restaurant's online ordering
    toast({
      title: 'Online Ordering',
      description: 'Online ordering integration coming soon!',
    });
    onClose();
  };

  const handleFavorite = () => {
    favoriteMutation.mutate(restaurant.id);
    onClose();
  };

  const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md floating-card">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-vegan-light-green rounded-xl flex items-center justify-center mr-4">
              <i className="fas fa-utensils text-vegan-green text-2xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-poppins font-semibold text-lg mb-1">{restaurant.name}</h3>
              <div className="flex items-center mb-1">
                <ScoreBadge score={veganScore} size="sm" className="mr-2" />
                <span className="text-neutral-gray text-sm">
                  {restaurant.cuisineTypes?.join(', ') || 'Restaurant'}
                </span>
              </div>
              <p className="text-neutral-gray text-sm">{restaurant.address}</p>
            </div>
            <Button 
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-neutral-gray"></i>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleViewDetails}
              className="bg-vegan-green text-white py-3 px-4 rounded-xl font-opensans font-medium hover:bg-vegan-dark-green transition-colors"
            >
              <i className="fas fa-eye mr-2"></i>View Details
            </Button>
            <Button 
              onClick={handleNavigate}
              className="bg-blue-500 text-white py-3 px-4 rounded-xl font-opensans font-medium hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-directions mr-2"></i>Navigate
            </Button>
            <Button 
              onClick={handleReserve}
              className="bg-purple-500 text-white py-3 px-4 rounded-xl font-opensans font-medium hover:bg-purple-600 transition-colors"
            >
              <i className="fas fa-calendar mr-2"></i>Website
            </Button>
            <Button 
              onClick={handleFavorite}
              disabled={favoriteMutation.isPending}
              className="bg-red-500 text-white py-3 px-4 rounded-xl font-opensans font-medium hover:bg-red-600 transition-colors"
            >
              <i className="fas fa-heart mr-2"></i>Favorite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
