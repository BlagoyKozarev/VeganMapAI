import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { MapPin, Star, Filter, Heart, ChefHat, Bot, Shield, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import GoogleMapView from '../components/GoogleMapView';
import { API_ENDPOINTS } from '@/config';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showFeatures, setShowFeatures] = useState(false);

  // Fetch restaurants for preview map
  const { data: restaurantsData } = useQuery({
    queryKey: [API_ENDPOINTS.mapData],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.mapData);
      if (!res.ok) throw new Error('Failed to fetch restaurants');
      return res.json();
    }
  });

  const restaurants = restaurantsData?.restaurants || [];
  
  console.log('[LANDING] Landing page loaded');

  const handleLogin = () => {
    // Navigate to Firebase Auth page
    setLocation('/auth');
  };

  const handleRestaurantClick = (restaurant: any) => {
    console.log('[LANDING] Restaurant clicked:', restaurant.name);
  };

  // Normalize restaurant data for Google Maps
  const normalizedRestaurants = restaurants.map((r: any) => ({
    id: r.id || r.placeId,
    name: r.name,
    lat: parseFloat(r.lat || r.latitude),
    lng: parseFloat(r.lng || r.longitude),
    rating: r.rating ? parseFloat(r.rating) : undefined,
    place_id: r.placeId
  })).filter((r: any) => !isNaN(r.lat) && !isNaN(r.lng));

  // Fetch restaurant stats
  const { data: stats } = useQuery({
    queryKey: [API_ENDPOINTS.userStats],
    queryFn: async () => {
      try {
        const response = await fetch(API_ENDPOINTS.mapData);
        const data = await response.json();
        return {
          totalRestaurants: data?.length || 5,
          cities: 1,
          avgScore: 4.2
        };
      } catch {
        return { totalRestaurants: 5, cities: 1, avgScore: 4.2 };
      }
    }
  });

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Interactive Map",
      description: "Explore vegan restaurants in your area with detailed information"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Intelligent recommendations based on your preferences"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Vegan Scores",
      description: "6-dimensional scoring system for vegan-friendly establishments"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Smart Filters",
      description: "Filter by price, cuisine, allergens and more"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Favorite Places",
      description: "Save and organize your favorite restaurants"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Data",
      description: "Up-to-date information from Google Places and user reviews"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">VeganMapAI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
              <a href="#api" className="text-gray-600 hover:text-green-600 transition-colors">API Access</a>
              <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
            </nav>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleLogin}
            >
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Discover the Best Vegan Restaurants
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            VeganMapAI helps you discover the best vegan-friendly places around you, 
            using an intelligent scoring and filtering system. 
            Find restaurants, view ratings, and get personalized recommendations.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Button 
              size="lg"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Scroll to map section if already on /map, otherwise navigate
                const mapSection = document.querySelector('#map-preview');
                if (mapSection) {
                  mapSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setLocation('/home');
                }
              }}
            >
              <Navigation className="w-5 h-5 mr-2" />
              Explore the Map
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => setShowFeatures(true)}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.totalRestaurants || 408}+
              </div>
              <div className="text-gray-600">Restaurants</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.cities || 1}
              </div>
              <div className="text-gray-600">Cities</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.avgScore || 4.2}
              </div>
              <div className="text-gray-600">Average Score</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {(showFeatures || true) && (
        <section id="features" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What We Offer
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Interactive Map with Vegan Restaurants
          </h3>
          <Card className="overflow-hidden" id="map-preview">
            <div className="relative h-96">
              <GoogleMapView 
                restaurants={normalizedRestaurants}
                onRestaurantClick={handleRestaurantClick}
                className="w-full h-96 rounded-lg overflow-hidden shadow-lg"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Vegan Paradise?
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users who are already finding the perfect vegan spots
          </p>
          <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={handleLogin}
          >
            Start for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">VeganMapAI</h4>
              <p className="text-gray-400">
                Your guide to vegan restaurants
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" onClick={handleLogin} className="hover:text-white">Map</a></li>
                <li><a href="#" onClick={handleLogin} className="hover:text-white">AI Assistant</a></li>
                <li><a href="#" onClick={handleLogin} className="hover:text-white">Profile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">For Developers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#api" className="hover:text-white">API Access</a></li>
                <li><a href="#docs" className="hover:text-white">Documentation</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              </ul>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">
                  hello@veganmapai.ai<br />
                  Sofia, Bulgaria
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VeganMapAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
