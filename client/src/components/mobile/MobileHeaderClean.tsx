import React from 'react';

interface MobileHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
  searchSuggestions: any[];
  onOpenChat?: () => void;
}

export function MobileHeader({ searchQuery, onSearchChange, showSuggestions, onShowSuggestions, searchSuggestions, onOpenChat }: MobileHeaderProps) {
  return (
    <header 
      className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg h-16 z-[99999]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '64px',
        zIndex: 99999
      }}
    >
      <div className="flex items-center px-4 py-2 h-full">
        <div className="flex-1 relative mr-2">
          <div className="bg-gray-50 border border-gray-300 rounded-full shadow-sm flex items-center px-3 py-1.5">
            <div className="text-gray-400 mr-2 text-sm">🔍</div>
            <input
              type="text"
              placeholder="Search vegan places..."
              className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => onShowSuggestions(searchQuery.length > 1)}
              onBlur={() => setTimeout(() => onShowSuggestions(false), 200)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-[100000]">
              {/* Restaurants */}
              {searchSuggestions.filter(s => s.type === 'restaurant').slice(0, 15).map((restaurant, index) => (
                <div
                  key={`restaurant-${index}`}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    onSearchChange(restaurant.name);
                    onShowSuggestions(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">🍽️</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 font-medium truncate">{restaurant.name}</div>
                      <div className="text-sm text-gray-500 truncate">{restaurant.address}</div>
                    </div>
                    {restaurant.veganScore && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {restaurant.veganScore}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Cuisines */}
              {searchSuggestions.filter(s => s.type === 'cuisine').slice(0, 5).map((cuisine, index) => (
                <div
                  key={`cuisine-${index}`}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    onSearchChange(cuisine.name);
                    onShowSuggestions(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🏷️</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-700 capitalize font-medium">{cuisine.name}</div>
                      <div className="text-sm text-gray-500">Cuisine type</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* No results message */}
              {searchSuggestions.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-sm">No results found</div>
                  <div className="text-xs mt-1">Try a different search term</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Navigation Icons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onOpenChat || (() => window.location.href = '/ai-chat')}
            className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95" 
            title="AI Voice Assistant"
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-white text-lg">🎤</span>
          </button>
          <a href="/profile">
            <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ touchAction: 'manipulation' }}>
              BK
            </button>
          </a>
        </div>
      </div>
    </header>
  );
}