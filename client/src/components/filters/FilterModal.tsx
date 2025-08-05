import { Button } from '@/components/ui/button';
import { RestaurantFilters, FilterOptions } from './RestaurantFilters';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface FilterModalProps {
  restaurants: any[];
  filteredCount: number;
  totalCount: number;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterModal({ 
  restaurants, 
  filteredCount,
  totalCount,
  onFiltersChange 
}: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button with Count */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {filteredCount !== totalCount && (
          <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
            {filteredCount}/{totalCount}
          </span>
        )}
      </Button>

      {/* Desktop Filter Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute top-full right-0 mt-2 z-[999]">
            <RestaurantFilters
              restaurants={restaurants}
              onFiltersChange={onFiltersChange}
              onClose={() => setIsOpen(false)}
              isMobile={false}
            />
          </div>
        </>
      )}
    </>
  );
}