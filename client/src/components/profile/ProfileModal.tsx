import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, Heart, Search, Settings, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowFavorites: () => void;
}

interface UserPreferences {
  defaultLat?: number;
  defaultLng?: number;
  preferredCuisines?: string[];
  minVeganScore?: number;
  searchRadius?: number;
}

export function ProfileModal({ isOpen, onClose, onShowFavorites }: ProfileModalProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [preferences, setPreferences] = useState<UserPreferences>({
    searchRadius: 10
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['/api/v1/user/stats'],
    enabled: isAuthenticated,
    retry: false
  });

  // Fetch user favorites count
  const { data: favoritesData } = useQuery({
    queryKey: ['/api/v1/favorites'],
    enabled: isAuthenticated,
    retry: false
  });

  // Get current location
  useEffect(() => {
    if (navigator.geolocation && isAuthenticated) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPreferences(prev => ({
            ...prev,
            defaultLat: position.coords.latitude,
            defaultLng: position.coords.longitude
          }));
        },
        () => {
          // Fallback to Sofia center
          setPreferences(prev => ({
            ...prev,
            defaultLat: 42.6977,
            defaultLng: 23.3219
          }));
        }
      );
    }
  }, [isAuthenticated]);

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      return await apiRequest('POST', '/api/v1/user/preferences', prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/user/preferences'] });
    }
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1002]" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[1003] px-4">
        <Card className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-8 h-8 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  {isAuthenticated ? 'My Profile' : 'Profile'}
                </h2>
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
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : !isAuthenticated ? (
              /* Not Logged In State */
              <div className="text-center py-8">
                <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Login to Access Profile
                </h3>
                <p className="text-gray-600 mb-6">
                  Create an account to save favorites, track visits, and personalize your experience!
                </p>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Login with Replit
                </Button>
                
                <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Benefits of logging in:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Save your favorite restaurants</li>
                    <li>• Track restaurants you've visited</li>
                    <li>• Set default location and preferences</li>
                    <li>• Get personalized recommendations</li>
                    <li>• Access your search history</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Logged In State */
              <>
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                  <Button
                    onClick={() => setActiveTab('profile')}
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="flex-1"
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={() => setActiveTab('preferences')}
                    variant={activeTab === 'preferences' ? 'default' : 'ghost'}
                    className="flex-1"
                  >
                    Preferences
                  </Button>
                </div>

                {activeTab === 'profile' ? (
                  /* Profile Tab */
                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {user?.firstName || user?.email || 'User'}
                      </h3>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">
                          {favoritesData?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Favorites</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">
                          {userStats?.searchesCount || 0}
                        </p>
                        <p className="text-sm text-gray-600">Searches</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button 
                        onClick={() => {
                          onShowFavorites();
                          onClose();
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        View My Favorites
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/api/logout'}
                        variant="outline"
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Preferences Tab */
                  <div className="space-y-4">
                    {/* Location */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Default Location
                      </Label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          {preferences.defaultLat && preferences.defaultLng
                            ? `${preferences.defaultLat.toFixed(4)}, ${preferences.defaultLng.toFixed(4)}`
                            : 'Sofia Center (Default)'}
                        </p>
                        <Button
                          size="sm"
                          variant="link"
                          className="mt-1 p-0 h-auto"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setPreferences(prev => ({
                                    ...prev,
                                    defaultLat: position.coords.latitude,
                                    defaultLng: position.coords.longitude
                                  }));
                                },
                                () => alert('Location access denied')
                              );
                            }
                          }}
                        >
                          Update to current location
                        </Button>
                      </div>
                    </div>

                    {/* Minimum Vegan Score */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Minimum Vegan Score: {preferences.minVeganScore || 0} ⭐
                      </Label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={preferences.minVeganScore || 0}
                        onChange={(e) => setPreferences(prev => ({ ...prev, minVeganScore: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Search Radius */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Search Radius
                      </Label>
                      <Select 
                        value={preferences.searchRadius?.toString() || '10'} 
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, searchRadius: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 km</SelectItem>
                          <SelectItem value="10">10 km</SelectItem>
                          <SelectItem value="25">25 km</SelectItem>
                          <SelectItem value="50">50 km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={() => savePreferencesMutation.mutate(preferences)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      disabled={savePreferencesMutation.isPending}
                    >
                      {savePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}