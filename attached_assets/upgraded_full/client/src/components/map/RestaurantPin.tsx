import type { Restaurant } from '@shared/schema';

interface RestaurantPinProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
  showLabel?: boolean;
}

export default function RestaurantPin({ restaurant, onClick, showLabel }: RestaurantPinProps) {
  const veganScore = restaurant.veganScore ? parseFloat(restaurant.veganScore) : 0;
  
  const getPinColor = () => {
    return 'bg-vegan-green'; // Always green regardless of score
  };

  const getScoreText = () => {
    return veganScore ? veganScore.toFixed(1) : '?';
  };

  return (
    <div className="relative">
      <div
        className={`score-badge ${getPinColor()} text-white rounded-full w-12 h-12 flex items-center justify-center font-poppins font-semibold text-sm cursor-pointer hover:scale-110 transition-transform`}
        onClick={() => onClick(restaurant)}
      >
        {getScoreText()}
      </div>
      
      {showLabel && (
        <div className="bg-white px-3 py-1 rounded-lg shadow-md mt-2 text-xs font-opensans font-medium absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {restaurant.name}
        </div>
      )}
    </div>
  );
}
