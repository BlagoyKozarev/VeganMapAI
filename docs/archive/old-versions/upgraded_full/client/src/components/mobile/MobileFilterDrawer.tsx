import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MobileFilterDrawerProps {
  minVeganScore: number;
  minGoogleScore: number;
  onVeganScoreChange: (value: number) => void;
  onGoogleScoreChange: (value: number) => void;
}

export function MobileFilterDrawer({ 
  minVeganScore, 
  minGoogleScore, 
  onVeganScoreChange, 
  onGoogleScoreChange 
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
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[50vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Filters</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
              >
                <span className="text-gray-500">✕</span>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Vegan Score Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Minimum Vegan Score: {minVeganScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minVeganScore}
                  onChange={(e) => onVeganScoreChange(parseFloat(e.target.value))}
                  className="w-full h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 - Poor</span>
                  <span>5 - Fair</span>
                  <span>10 - Excellent</span>
                </div>
              </div>

              {/* Google Score Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Minimum Google Rating: {minGoogleScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minGoogleScore}
                  onChange={(e) => onGoogleScoreChange(parseFloat(e.target.value))}
                  className="w-full h-4 bg-gradient-to-r from-red-200 to-green-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 ⭐</span>
                  <span>2.5 ⭐⭐⭐</span>
                  <span>5 ⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    onVeganScoreChange(0);
                    onGoogleScoreChange(0);
                  }}
                  variant="outline"
                  className="w-full py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}