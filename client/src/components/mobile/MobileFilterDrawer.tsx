import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RestaurantFilters, FilterOptions } from '@/components/filters/RestaurantFilters';

interface MobileFilterDrawerProps {
  restaurants: any[];
  filteredCount: number;
  totalCount: number;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function MobileFilterDrawer({ 
  restaurants,
  filteredCount,
  totalCount,
  onFiltersChange
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Enhanced Mobile Filter Toggle Button */}
      <div className="sm:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-white text-xl">🎚️</span>
          {filteredCount !== totalCount && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {filteredCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with count */}
            <div className="sticky top-0 bg-white p-4 pb-0 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <span className="text-sm text-gray-600 font-medium">
                  {filteredCount} of {totalCount} restaurants
                </span>
              </div>
            </div>
            
            {/* Filters Content */}
            <RestaurantFilters
              restaurants={restaurants}
              onFiltersChange={onFiltersChange}
              onClose={() => setIsOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </>
  );
}