import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface ActionMenuProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function ActionMenu({ restaurant, onClose }: ActionMenuProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
    toast({
      title: 'Added to Favorites',
      description: `${restaurant.name} has been added to your favorites.`,
    });
    onClose();
  };

  const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;

  console.log('ActionMenu rendering for restaurant:', restaurant.name);
  
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-end justify-center p-0"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        backdropFilter: 'blur(2px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl shadow-2xl p-6 m-4 mb-0"
        style={{ 
          zIndex: 999999,
          transform: 'translateY(0)',
          animation: 'slideUp 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold text-lg">
                {veganScore ? veganScore.toFixed(1) : '?'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{restaurant.name}</h3>
              <p className="text-gray-500 text-sm">{restaurant.cuisineTypes?.join(', ') || 'Restaurant'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleViewDetails}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            View Details
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleNavigate}
              className="bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Navigate
            </Button>
            <Button 
              onClick={handleReserve}
              className="bg-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-purple-600 transition-colors"
            >
              Website
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
