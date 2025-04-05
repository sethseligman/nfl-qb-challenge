import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">StatStack</span>
            </Link>
          </div>

          {/* Sports Tabs */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/nfl-qb-challenge"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/nfl-qb-challenge')
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                NFL QB Challenge
              </Link>
              <Link
                to="/nba"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/nba')
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                NBA
              </Link>
              {/* Add more sports tabs as needed */}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">{user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 