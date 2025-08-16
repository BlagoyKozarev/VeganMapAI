import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  type: 'restaurant' | 'location' | 'cuisine' | 'recent';
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
}

interface FloatingSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  className?: string;
}

export function FloatingSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search restaurants, cuisines...",
  suggestions = [],
  loading = false,
  className
}: FloatingSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed top-4 left-4 right-4 z-40 transition-all duration-300",
        className
      )}
      style={{
        top: 'calc(var(--safe-area-inset-top) + 1rem)'
      }}
    >
      {/* Search Bar */}
      <div 
        className={cn(
          "bg-white rounded-2xl shadow-lg border transition-all duration-300",
          isExpanded ? "shadow-2xl border-primary/20" : "shadow-md border-gray-200"
        )}
      >
        <form onSubmit={handleSubmit} className="flex items-center p-3 gap-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            disabled={loading}
          />
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          )}
        </form>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon || MapPin;
              
              return (
                <button
                  key={suggestion.id || index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  {suggestion.type === 'recent' && (
                    <Clock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}