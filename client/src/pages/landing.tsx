import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { MapPin, Star, Filter, Heart, ChefHat, Bot, Shield, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import SimpleClusterMap from '../components/map/SimpleClusterMap';
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
    window.location.href = '/api/login';
  };

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
      title: "Интерактивна карта",
      description: "Разгледай веган ресторанти в твоя район с подробна информация"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI асистент",
      description: "Интелигентни препоръки базирани на твоите предпочитания"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Веган оценки",
      description: "6-измерна система за оценка на веган приятелски заведения"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Умни филтри",
      description: "Филтрирай по цена, кухня, алергени и още"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Любими места",
      description: "Запазвай и организирай любимите си ресторанти"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Проверени данни",
      description: "Актуална информация от Google Places и потребителски отзиви"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Temporary Link to Mock Page */}
      <div className="bg-blue-100 border-b border-blue-200 py-2">
        <div className="container mx-auto px-4">
          <a 
            href="/pages/mock-step1.html" 
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-2"
          >
            ➡ Mock Step 1 (CTA + Navigation)
          </a>
        </div>
      </div>

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
            Открий най-добрите веган ресторанти
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            VeganMapAI ти помага да откриеш най-добрите веган заведения около теб, 
            използвайки интелигентна система за оценка и филтрация. 
            Намери ресторанти, виж оценки и персонализирани препоръки.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <a href="/test-map">
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Разгледай картата
              </Button>
            </a>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => setShowFeatures(true)}
            >
              Научи повече
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.totalRestaurants || 408}+
              </div>
              <div className="text-gray-600">Ресторанти</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.cities || 1}
              </div>
              <div className="text-gray-600">Градове</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.avgScore || 4.2}
              </div>
              <div className="text-gray-600">Средна оценка</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {(showFeatures || true) && (
        <section id="features" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Какво предлагаме
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
            Интерактивна карта с веган ресторанти
          </h3>
          <Card className="overflow-hidden">
            <div className="relative h-96">
              <SimpleClusterMap 
                restaurants={restaurants || []} 
                center={[42.6977, 23.3219]}
                zoom={12}
                className="w-full h-full"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Готов ли си да откриеш веган рая?
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Присъедини се към хиляди потребители, които вече намират перфектното веган място
          </p>
          <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={handleLogin}
          >
            Започни безплатно
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
                Твоят гид към веган ресторанти
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Бързи връзки</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" onClick={handleLogin} className="hover:text-white">Карта</a></li>
                <li><a href="#" onClick={handleLogin} className="hover:text-white">AI Асистент</a></li>
                <li><a href="#" onClick={handleLogin} className="hover:text-white">Профил</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">За разработчици</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#api" className="hover:text-white">API достъп</a></li>
                <li><a href="#docs" className="hover:text-white">Документация</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Контакт</h4>
              <p className="text-gray-400">
                hello@veganmapai.ai<br />
                София, България
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VeganMapAI. Всички права запазени.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
