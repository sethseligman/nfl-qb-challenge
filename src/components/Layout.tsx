import React from 'react';
import { Link } from 'react-router-dom';

const SPORTS_TABS = [
  { id: 'nfl', name: 'NFL', path: '/nfl' },
  { id: 'nba', name: 'NBA', path: '/nba' },
  { id: 'mlb', name: 'MLB', path: '/mlb' },
  { id: 'nhl', name: 'NHL', path: '/nhl' },
  { id: 'soccer', name: 'Soccer', path: '/soccer' }
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/statstack-logo.png"
                alt="StatStack"
                className="h-8 w-auto"
              />
            </Link>

            {/* Login Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Login
            </button>
          </div>

          {/* Sports Tabs */}
          <div className="border-t border-gray-700">
            <nav className="flex space-x-8 py-2">
              {SPORTS_TABS.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}; 