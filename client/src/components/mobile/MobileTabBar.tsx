import { MapPin, MessageSquare, Heart, User, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const tabs: TabItem[] = [
  {
    id: 'map',
    label: 'Map',
    icon: MapPin,
    path: '/'
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    path: '/search'
  },
  {
    id: 'chat',
    label: 'AI Chat',
    icon: MessageSquare,
    path: '/chat'
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: Heart,
    path: '/favorites'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile'
  }
];

export function MobileTabBar() {
  const [location] = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1"
      style={{
        paddingBottom: 'calc(var(--safe-area-inset-bottom) + 0.25rem)'
      }}
    >
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path || 
            (tab.path !== '/' && location.startsWith(tab.path));
          
          return (
            <Link key={tab.id} href={tab.path}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-[60px] relative",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium mt-1 font-opensans">
                  {tab.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}