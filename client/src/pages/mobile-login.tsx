import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function MobileLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      setLocation('/profile-setup');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    setLocation('/');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col"
      style={{
        paddingTop: 'var(--safe-area-inset-top)',
        paddingBottom: 'var(--safe-area-inset-bottom)'
      }}
    >
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">V</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
            VeganMapAI
          </h1>
          
          <p className="text-gray-600 font-opensans text-lg leading-relaxed">
            Discover amazing vegan restaurants with AI-powered recommendations
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-lg">🗺️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 font-poppins">Smart Map Discovery</h3>
              <p className="text-sm text-gray-600 font-opensans">Find vegan-friendly places near you</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 font-poppins">AI Recommendations</h3>
              <p className="text-sm text-gray-600 font-opensans">Personalized suggestions just for you</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-lg">⭐</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 font-poppins">Vegan Scoring</h3>
              <p className="text-sm text-gray-600 font-opensans">Transparent ratings you can trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Actions */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Connecting...</span>
              </div>
            ) : (
              'Continue with Replit'
            )}
          </Button>

          <Button
            onClick={handleGuestMode}
            variant="outline"
            className="w-full h-14 text-base font-semibold rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
          >
            Explore as Guest
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4 font-opensans">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}