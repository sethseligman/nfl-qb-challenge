import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const SPORTS_TABS = ['NFL', 'NBA', 'MLB', 'Soccer', 'More'];

interface AppLayoutProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ activeTab = 'NFL', onTabChange }) => {
  const location = useLocation();
  const isMainLobby = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">StatStack</h1>
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
                onClick={() => onTabChange?.(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  !isMainLobby && activeTab === tab
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}; 