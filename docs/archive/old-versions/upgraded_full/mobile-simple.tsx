import { useState, useEffect } from 'react';

export function SimpleMobileHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg h-14 z-50">
      <div className="flex items-center px-4 py-2 h-full">
        {/* Search Bar */}
        <div className="flex-1 relative mr-2">
          <div className="bg-gray-50 border border-gray-300 rounded-full shadow-sm flex items-center px-3 py-1.5">
            <i className="fas fa-search text-gray-400 mr-2 text-sm"></i>
            <input
              type="text"
              placeholder="Search vegan places..."
              className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
            />
          </div>
        </div>
        
        {/* Icons */}
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