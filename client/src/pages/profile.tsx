import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TabNavigation from '@/components/layout/TabNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useRestaurants';
import { UserStats } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/profile/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useFavorites();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleEditProfile = () => {
    toast({
      title: 'Coming Soon',
      description: 'Profile editing will be available in a future update.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Data Export Requested',
      description: 'Your data export will be sent to your email address within 24 hours.',
    });
  };

  const handlePrivacySettings = () => {
    toast({
      title: 'Coming Soon',
      description: 'Privacy settings will be available in a future update.',
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vegan-green rounded-2xl mb-4 animate-pulse">
            <i className="fas fa-user text-white text-2xl"></i>
          </div>
          <p className="text-neutral-gray font-opensans">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };

  const getDietaryStyleLabel = () => {
    if (!user?.profile?.dietaryStyle) return 'Not set';
    return user.profile.dietaryStyle.charAt(0).toUpperCase() + user.profile.dietaryStyle.slice(1);
  };

  return (
    <div className="min-h-screen bg-light-gray pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-poppins font-semibold">Profile</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-vegan-green rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-poppins font-bold text-white">
                    {getUserInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-poppins font-semibold mb-1">{getUserName()}</h2>
                <p className="text-neutral-gray mb-2">{user?.email || 'No email available'}</p>
                <span className="bg-vegan-light-green text-vegan-green px-3 py-1 rounded-full text-sm font-opensans font-medium">
                  {getDietaryStyleLabel()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={handleEditProfile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-edit text-neutral-gray"></i>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                >
                  Изход
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-poppins font-bold text-vegan-green mb-1">
                {statsLoading ? '...' : userStats?.placesVisited || 0}
              </div>
              <p className="text-sm font-opensans text-neutral-gray">Places Visited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-poppins font-bold text-blue-600 mb-1">
                {favoritesLoading ? '...' : favorites.length}
              </div>
              <p className="text-sm font-opensans text-neutral-gray">Favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-poppins font-bold text-purple-600 mb-1">
                {statsLoading ? '...' : userStats?.reviews || 0}
              </div>
              <p className="text-sm font-opensans text-neutral-gray">Reviews</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Dietary Preferences */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold">Dietary Preferences</h3>
              <Button 
                variant="ghost"
                onClick={handleEditProfile}
                className="text-vegan-green font-opensans font-medium hover:bg-vegan-light-green"
              >
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-opensans text-neutral-gray">Diet Type</span>
                <span className="font-opensans font-medium">{getDietaryStyleLabel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-opensans text-neutral-gray">Price Range</span>
                <span className="font-opensans font-medium">
                  {user?.profile?.priceRange || 'Not set'}
                </span>
              </div>
              {user?.profile?.allergies && user.profile.allergies.length > 0 && (
                <div>
                  <span className="font-opensans text-neutral-gray block mb-2">Allergies</span>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.allergies.map((allergy) => (
                      <span 
                        key={allergy}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-opensans"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {user?.profile?.preferredCuisines && user.profile.preferredCuisines.length > 0 && (
                <div>
                  <span className="font-opensans text-neutral-gray block mb-2">Preferred Cuisines</span>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.preferredCuisines.map((cuisine) => (
                      <span 
                        key={cuisine}
                        className="bg-vegan-light-green text-vegan-green px-3 py-1 rounded-full text-sm font-opensans"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-poppins font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {userStats?.avgVeganScore && userStats.avgVeganScore > 0 ? (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-vegan-green rounded-full"></div>
                  <span className="font-opensans text-sm text-neutral-gray">
                    Average vegan score: {userStats.avgVeganScore.toFixed(1)}/10
                  </span>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-utensils text-neutral-gray text-2xl mb-2"></i>
                  <p className="font-opensans text-neutral-gray">
                    No activity yet. Start exploring vegan restaurants!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* App Settings */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-poppins font-semibold mb-4">App Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="font-opensans">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="location" className="font-opensans">Location Services</Label>
                <Switch
                  id="location"
                  checked={locationEnabled}
                  onCheckedChange={setLocationEnabled}
                />
              </div>
              <Button 
                variant="ghost"
                onClick={handleExportData}
                className="w-full text-left py-3 font-opensans text-neutral-gray hover:text-gray-900 hover:bg-gray-50 transition-colors justify-start"
              >
                Export My Data
              </Button>
              <Button 
                variant="ghost"
                onClick={handlePrivacySettings}
                className="w-full text-left py-3 font-opensans text-neutral-gray hover:text-gray-900 hover:bg-gray-50 transition-colors justify-start"
              >
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Logout */}
        <Card className="mb-20">
          <CardContent className="p-6">
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="w-full text-left py-3 font-opensans text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors justify-start"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <TabNavigation currentTab="profile" />
    </div>
  );
}
