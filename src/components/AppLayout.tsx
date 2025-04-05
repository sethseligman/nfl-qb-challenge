import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';

const SPORTS_TABS = ['NFL', 'NBA', 'MLB', 'Soccer', 'More'];

interface AppLayoutProps {
  onTabChange?: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ onTabChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const currentSport = location.pathname.split('/')[1]?.toUpperCase() || '';

  const handleTabClick = (tab: string) => {
    if (tab === 'More') {
      navigate('/more');
      return;
    }
    
    const sportPath = tab.toLowerCase();
    navigate(`/${sportPath}`);
    onTabChange?.(tab);
  };

  const isTabActive = (tab: string) => {
    if (isHomePage) return false;
    if (tab === 'More') {
      return location.pathname === '/more';
    }
    if (tab === 'Soccer') {
      return location.pathname === '/soccer';
    }
    return currentSport === tab;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
          StatStack
        </Link>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Login
        </button>
      </nav>

      {/* Tab Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto">
            {SPORTS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  isTabActive(tab)
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}; 