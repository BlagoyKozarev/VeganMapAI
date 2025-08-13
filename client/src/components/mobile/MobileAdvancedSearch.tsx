import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, X } from 'lucide-react';

interface MobileAdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

interface SearchFilters {
  minVeganScore: number;
  minGoogleScore: number;
  maxDistance: number;
  priceRange: string[];
  cuisineTypes: string[];
  allergies: string[];
  customAllergy?: string;
}

const PRICE_OPTIONS = [
  { value: '1', label: '$ - Евтино' },
  { value: '2', label: '$$ - Умерено' },
  { value: '3', label: '$$$ - Скъпо' },
  { value: '4', label: '$$$$ - Много скъпо' },
];

const CUISINE_OPTIONS = [
  'Вегански', 'Вегетариански', 'Индийска', 'Средиземноморска', 
  'Азиатска', 'Мексиканска', 'Италианска', 'Тайландска', 
  'Китайска', 'Японска', 'Гръцка', 'Ливанска'
];

const ALLERGY_OPTIONS = [
  'Глутен', 'Лактоза', 'Ядки', 'Соя', 
  'Яйца', 'Риба', 'Ракообразни', 'Сусам'
];

export function MobileAdvancedSearch({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  initialFilters 
}: MobileAdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      minVeganScore: 0,
      minGoogleScore: 0,
      maxDistance: 10,
      priceRange: [],
      cuisineTypes: [],
      allergies: [],
      customAllergy: ''
    }
  );

  const [customAllergy, setCustomAllergy] = useState('');

  const handlePriceRangeChange = (value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      priceRange: checked 
        ? [...prev.priceRange, value]
        : prev.priceRange.filter(p => p !== value)
    }));
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      cuisineTypes: checked 
        ? [...prev.cuisineTypes, cuisine]
        : prev.cuisineTypes.filter(c => c !== cuisine)
    }));
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      allergies: checked 
        ? [...prev.allergies, allergy]
        : prev.allergies.filter(a => a !== allergy)
    }));
  };

  const handleAddCustomAllergy = () => {
    if (customAllergy.trim() && !filters.allergies.includes(customAllergy.trim())) {
      setFilters(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFilters(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const handleSave = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minVeganScore: 0,
      minGoogleScore: 0,
      maxDistance: 10,
      priceRange: [],
      cuisineTypes: [],
      allergies: [],
      customAllergy: ''
    };
    setFilters(resetFilters);
    setCustomAllergy('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[2001] overflow-y-auto">
      {/* Header with Back and Save buttons */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        
        <h1 className="text-lg font-semibold">Разширено търсене</h1>
        
        <Button
          onClick={handleSave}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Запази
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Vegan Score Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Минимален Vegan Score: {filters.minVeganScore}
          </Label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minVeganScore}
            onChange={(e) => setFilters(prev => ({ ...prev, minVeganScore: parseFloat(e.target.value) }))}
            className="w-full h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 - Слабо</span>
            <span>5 - Добре</span>
            <span>10 - Отлично</span>
          </div>
        </div>

        {/* Google Score Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Минимален Google Rating: {filters.minGoogleScore}
          </Label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={filters.minGoogleScore}
            onChange={(e) => setFilters(prev => ({ ...prev, minGoogleScore: parseFloat(e.target.value) }))}
            className="w-full h-4 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 ⭐</span>
            <span>2.5 ⭐⭐⭐</span>
            <span>5 ⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Максимално разстояние: {filters.maxDistance} км
          </Label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={filters.maxDistance}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
            className="w-full h-4 bg-gradient-to-r from-green-200 to-red-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 км</span>
            <span>25 км</span>
            <span>50 км</span>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Ценови диапазон
          </Label>
          <div className="space-y-2">
            {PRICE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${option.value}`}
                  checked={filters.priceRange.includes(option.value)}
                  onCheckedChange={(checked) => handlePriceRangeChange(option.value, checked as boolean)}
                />
                <Label htmlFor={`price-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisine Types */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Тип кухня
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {CUISINE_OPTIONS.map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox
                  id={`cuisine-${cuisine}`}
                  checked={filters.cuisineTypes.includes(cuisine)}
                  onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                />
                <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                  {cuisine}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Алергии и диетични ограничения
          </Label>
          
          {/* All allergies including custom ones */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {ALLERGY_OPTIONS.map((allergy) => (
              <div key={allergy} className="flex items-center space-x-2">
                <Checkbox
                  id={`allergy-${allergy}`}
                  checked={filters.allergies.includes(allergy)}
                  onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                />
                <Label htmlFor={`allergy-${allergy}`} className="text-sm">
                  {allergy}
                </Label>
              </div>
            ))}
            
            {/* Custom allergies that aren't in standard list */}
            {filters.allergies
              .filter(allergy => !ALLERGY_OPTIONS.includes(allergy))
              .map((customAllergy) => (
                <div key={customAllergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={`custom-allergy-${customAllergy}`}
                    checked={true}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        handleRemoveAllergy(customAllergy);
                      }
                    }}
                  />
                  <Label htmlFor={`custom-allergy-${customAllergy}`} className="text-sm text-purple-700 font-medium">
                    {customAllergy}
                  </Label>
                  <button
                    onClick={() => handleRemoveAllergy(customAllergy)}
                    className="ml-1 text-red-500 hover:text-red-700 text-xs"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
          </div>

          {/* Custom allergy input */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Добави специфична алергия:</Label>
            <div className="flex space-x-2">
              <Input
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Напр. авокадо, киноа..."
                className="text-sm"
              />
              <Button
                onClick={handleAddCustomAllergy}
                size="sm"
                variant="outline"
                disabled={!customAllergy.trim()}
              >
                Добави
              </Button>
            </div>
          </div>


        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Нулирай всички филтри
          </Button>
        </div>
      </div>
    </div>
  );
}