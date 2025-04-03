import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../firebase/config';

interface LobbyPageProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
}

export const LobbyPage: React.FC<LobbyPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('NFL');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const CATEGORIES = ['NFL', 'NBA', 'MLB', 'Soccer', 'More'];

  const GAMES = [
    {
      id: 1,
      title: 'NFL QB Challenge',
      tagline: 'Test your NFL knowledge!',
      status: 'LIVE',
      category: 'NFL',
      route: '/nfl-qb-challenge'
    },
    {
      id: 2,
      title: 'NBA Player Stats',
      tagline: 'Coming Soon',
      status: 'COMING SOON',
      category: 'NBA',
      route: '#'
    },
    {
      id: 3,
      title: 'MLB Trivia',
      tagline: 'Coming Soon',
      status: 'COMING SOON',
      category: 'MLB',
      route: '#'
    },
    {
      id: 4,
      title: 'Soccer Legends',
      tagline: 'Coming Soon',
      status: 'COMING SOON',
      category: 'Soccer',
      route: '#'
    },
    {
      id: 5,
      title: 'More Games',
      tagline: 'Coming Soon',
      status: 'COMING SOON',
      category: 'More',
      route: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-500">StatStack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.displayName?.[0] || user.email?.[0] || '?'}
                    </span>
                  </div>
                )}
                <span className="text-gray-300">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.filter(game => game.category === selectedCategory).map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    game.status === 'LIVE'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {game.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-6">{game.tagline}</p>
                <button
                  onClick={() => navigate(game.route)}
                  disabled={game.status !== 'LIVE'}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    game.status === 'LIVE'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 