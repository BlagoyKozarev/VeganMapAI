import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot, Search, Loader2, MapPin, Star, DollarSign } from 'lucide-react';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (results: any[]) => void;
}

const examplePrompts = [
  "Healthy vegan near me",
  "Restaurants without soy",
  "Best rated vegan places",
  "Cheap vegetarian food",
  "Italian vegan restaurants",
  "Gluten-free vegan options"
];

export function AISearchModal({ isOpen, onClose, onSearchResults }: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setAiResponse(null);

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Connection problem - please try again');
      }

      const data = await response.json();
      setAiResponse(data);
      onSearchResults(data.restaurants);
    } catch (err: any) {
      setError(err.message || 'AI search taking longer than expected... Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1002]" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[1003] sm:px-4">
        <Card className="bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden w-full max-w-2xl sm:mb-0 mobile-modal">
          <div className="max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
              <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="w-8 h-8 text-white mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">AI Restaurant Search</h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  placeholder="Ask me anything about vegan restaurants..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-12 text-lg py-6"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !query.trim()}
                  className="absolute right-1 top-1 bottom-1 px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Example Prompts */}
            {!aiResponse && !isLoading && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Try these example searches:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(prompt);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      className="text-sm"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600">AI is analyzing restaurants...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* AI Response */}
            {aiResponse && !isLoading && (
              <div className="space-y-6">
                {/* AI Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-2">AI Analysis:</p>
                  <p className="text-blue-700">{aiResponse.explanation}</p>
                </div>

                {/* Found Restaurants */}
                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Found {aiResponse.restaurants.length} matching restaurants:
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {aiResponse.restaurants.map((restaurant: any) => (
                      <div 
                        key={restaurant.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {restaurant.address}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                {restaurant.veganScore || 0} vegan
                              </span>
                              <span className="text-sm flex items-center">
                                <Star className="w-4 h-4 text-blue-500 mr-1" />
                                {restaurant.rating || 0} Google
                              </span>
                              {restaurant.priceLevel && (
                                <span className="text-sm flex items-center">
                                  <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                                  {'$'.repeat(restaurant.priceLevel)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      onClose();
                    }}
                    className="flex-1"
                  >
                    Show on Map
                  </Button>
                  <Button 
                    onClick={() => {
                      setQuery('');
                      setAiResponse(null);
                    }}
                    variant="outline"
                  >
                    New Search
                  </Button>
                </div>
              </div>
            )}
          </div>
          </div>
        </Card>
      </div>
    </>
  );
}