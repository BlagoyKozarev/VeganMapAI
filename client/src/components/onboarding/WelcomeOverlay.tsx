import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeOverlayProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeOverlay({ onGetStarted, onSkip }: WelcomeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    // Check if user has seen the welcome message
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsVisible(true);
      
      // Auto-close after 5 seconds on mobile devices
      if (isMobile) {
        const timer = setTimeout(() => {
          sessionStorage.setItem('hasSeenWelcome', 'true');
          setIsVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isMobile]);

  const handleGetStarted = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setIsVisible(false);
    onGetStarted();
  };

  const handleSkip = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setIsVisible(false);
    onSkip();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
            onClick={handleSkip}
          />
          
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-[1001] p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🌱</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome to VeganMapAI
                </h1>
                <p className="text-lg text-gray-600">
                  Discover vegan-friendly restaurants with AI-powered recommendations
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0 mt-1">🗺️</span>
                  <div>
                    <p className="text-gray-700">
                      Browse restaurants on the map - each marker shows vegan-friendliness score
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0 mt-1">🤖</span>
                  <div>
                    <p className="text-gray-700">
                      Try AI search: "healthy vegan near me" or "restaurants without soy"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0 mt-1">🎯</span>
                  <div>
                    <p className="text-gray-700">
                      Filter by cuisine, price, and ratings
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0 mt-1">❤️</span>
                  <div>
                    <p className="text-gray-700">
                      Save favorites and get personalized recommendations
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGetStarted}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 py-6 text-lg font-semibold"
                >
                  Skip Tour
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}