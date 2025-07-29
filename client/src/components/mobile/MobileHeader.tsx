import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
  searchSuggestions: any[];
  onSuggestionClick: (suggestion: any) => void;
}

export function MobileHeader({
  searchQuery,
  onSearchChange,
  showSuggestions,
  onShowSuggestions,
  searchSuggestions,
  onSuggestionClick
}: MobileHeaderProps) {
  return (
    <div className="sm:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg h-14 z-[1000]">
      <div className="flex items-center px-3 py-2 h-full">
        {/* Compact Search Bar */}
        <div className="flex-1 relative">
          <div className="bg-gray-50 border border-gray-200 rounded-full shadow-sm flex items-center px-3 py-2">
            <i className="fas fa-search text-gray-400 mr-2 text-xs"></i>
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
                onClick={() => {
                  onSearchChange('');
                  onShowSuggestions(false);
                }}
                className="text-gray-400 hover:text-gray-600 ml-1 p-1 rounded-full"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            )}
          </div>
          
          {/* Mobile Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl mt-1 max-h-60 overflow-y-auto z-[1002]">
              <div className="p-1">
                {searchSuggestions.slice(0, 4).map((suggestion, index) => (
                  <div
                    key={`${suggestion.type}-${suggestion.id}`}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-xl transition-colors"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        suggestion.type === 'restaurant' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <i className={`fas ${suggestion.type === 'restaurant' ? 'fa-utensils' : 'fa-tag'} text-xs`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{suggestion.name}</div>
                        {suggestion.veganScore && (
                          <div className="text-xs text-green-600 truncate">
                            🌱 {suggestion.veganScore}/10
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Compact Action Buttons */}
        <div className="flex items-center ml-2 space-x-1">
          <a href="/ai-chat">
            <Button 
              variant="ghost" 
              className="w-8 h-8 p-0 rounded-full"
              title="AI Assistant"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎤</span>
              </div>
            </Button>
          </a>
          <a href="/profile">
            <Button 
              variant="ghost" 
              className="w-8 h-8 p-0 rounded-full"
              title="Profile"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-medium">
                BK
              </div>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}