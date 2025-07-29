import React from 'react';

interface MobileHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileHeader({ searchQuery, onSearchChange }: MobileHeaderProps) {
  return (
    <header 
      className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg h-16 z-[99999]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '64px',
        zIndex: 99999
      }}
    >
      <div className="flex items-center px-4 py-2 h-full">
        <div className="flex-1 relative mr-2">
          <div className="bg-gray-50 border border-gray-300 rounded-full shadow-sm flex items-center px-3 py-1.5">
            <div className="text-gray-400 mr-2 text-sm">🔍</div>
            <input
              type="text"
              placeholder="Search vegan places..."
              className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <a href="/ai-chat">
            <button className="w-9 h-9 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-base">🎤</span>
            </button>
          </a>
          <a href="/profile">
            <button className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-md">
              BK
            </button>
          </a>
        </div>
      </div>
    </header>
  );
}