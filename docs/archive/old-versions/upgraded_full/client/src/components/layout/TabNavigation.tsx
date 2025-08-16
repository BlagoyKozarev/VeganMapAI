import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface TabNavigationProps {
  currentTab: 'map' | 'search' | 'agent' | 'profile';
}

export default function TabNavigation({ currentTab }: TabNavigationProps) {
  const [, setLocation] = useLocation();

  const tabs = [
    { id: 'map', icon: 'fa-map-marked-alt', label: 'Map', path: '/home' },
    { id: 'search', icon: 'fa-search', label: 'Search', path: '/search' },
    { id: 'agent', icon: 'fa-robot', label: 'AI Agent', path: '/ai-chat' },
    { id: 'profile', icon: 'fa-user', label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around py-3">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setLocation(tab.path)}
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              currentTab === tab.id
                ? 'text-vegan-green'
                : 'text-neutral-gray hover:text-vegan-green'
            }`}
          >
            <i className={`fas ${tab.icon} text-xl mb-1`}></i>
            <span className="text-xs font-opensans font-medium">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
