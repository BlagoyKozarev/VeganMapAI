import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchSuggestions } from '@/hooks/useRestaurants';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { position } = useGeolocation();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const suggestionsMutation = useSearchSuggestions();

  // Handle input change and fetch suggestions
  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (value.trim().length >= 2) {
      try {
        const results = await suggestionsMutation.mutateAsync({
          query: value.trim(),
          location: position || undefined,
        });
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setLocation(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center p-4">
        <i className="fas fa-search text-neutral-gray mr-3"></i>
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search for vegan places..."
          className="flex-1 outline-none border-none shadow-none font-opensans text-gray-700 focus-visible:ring-0"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
        />
        <Button
          onClick={() => setLocation('/search')}
          className="ml-3 p-2 bg-vegan-green rounded-xl text-white hover:bg-vegan-dark-green transition-colors"
        >
          <i className="fas fa-sliders-h"></i>
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-vegan-light-green transition-colors font-opensans text-gray-700 border-b border-gray-100 last:border-b-0"
            >
              <i className="fas fa-search text-neutral-gray mr-3 text-sm"></i>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
