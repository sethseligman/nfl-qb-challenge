import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Sport Tabs */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-white text-xl font-bold">StatStack</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/nfl-qb-challenge"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/nfl-qb-challenge'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    NFL QB Challenge
                  </Link>
                  {/* Add more sport tabs as needed */}
                </div>
              </div>
            </div>

            {/* Login/Account */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">{user.email}</span>
                  <button
                    onClick={logout}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 