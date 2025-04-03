import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPORTS = [
  { id: 'nfl', name: 'NFL', path: '/nfl-qb-challenge', description: 'NFL QB Challenge' },
  { id: 'nba', name: 'NBA', path: '/nba', description: 'NBA Scorer Challenge' },
  { id: 'mlb', name: 'MLB', path: '/mlb', description: 'MLB Pitcher Challenge' },
  { id: 'soccer', name: 'Soccer', path: '/soccer', description: 'Soccer Goals Challenge' }
];

export const Lobby: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nfl');
  const navigate = useNavigate();

  const handleTabClick = (sportId: string) => {
    setActiveTab(sportId);
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sport Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto">
            {SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleTabClick(sport.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === sport.id
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPORTS.map((sport) => (
            <div
              key={sport.id}
              onClick={() => handleCardClick(sport.path)}
              className="bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-blue-500 mb-2">{sport.name}</h3>
              <p className="text-gray-400">{sport.description}</p>
              {sport.id !== 'nfl' && (
                <span className="inline-block mt-4 text-sm text-blue-400">Coming Soon!</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 