import { ArrowLeft, Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onProfile?: () => void;
  onSearch?: () => void;
  transparent?: boolean;
}

export function MobileHeader({
  title,
  showBack = false,
  showMenu = false,
  showProfile = false,
  showSearch = false,
  onBack,
  onMenu,
  onProfile,
  onSearch,
  transparent = false
}: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b ${
        transparent 
          ? 'bg-white/80 backdrop-blur-sm border-white/20' 
          : 'bg-white border-gray-200'
      }`}
      style={{
        paddingTop: 'var(--safe-area-inset-top)'
      }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenu}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        <h1 className="font-poppins font-semibold text-lg text-gray-900 truncate mx-4">
          {title}
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearch}
              className="h-8 w-8 p-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {showProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfile}
              className="h-8 w-8 p-0 rounded-full overflow-hidden"
            >
              {user && (user as any).picture ? (
                <img 
                  src={(user as any).picture} 
                  alt="Profile" 
                  className="w-8 h-8 object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}