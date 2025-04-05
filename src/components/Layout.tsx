import React from 'react';
import { Link } from 'react-router-dom';

const SPORTS_TABS = [
  { id: 'nfl', label: 'NFL' },
  { id: 'nba', label: 'NBA' },
  { id: 'mlb', label: 'MLB' },
  { id: 'nhl', label: 'NHL' },
  { id: 'soccer', label: 'Soccer' }
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-500">StatStack</span>
            </Link>

            {/* Login Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Login
            </button>
          </div>

          {/* Sports Tabs */}
          <div className="border-t border-gray-700">
            <nav className="flex space-x-8 py-4">
              {SPORTS_TABS.map((tab) => (
                <Link
                  key={tab.id}
                  to={`/${tab.id}`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {tab.label}
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