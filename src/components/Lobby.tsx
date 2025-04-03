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
    <div className="min-h-screen bg-gray-100">
      {/* Sport Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleTabClick(sport.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === sport.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPORTS.map((sport) => (
            <div
              key={sport.id}
              onClick={() => handleCardClick(sport.path)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{sport.name}</h3>
              <p className="text-gray-600">{sport.description}</p>
              {sport.id !== 'nfl' && (
                <span className="inline-block mt-4 text-sm text-blue-600">Coming Soon!</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 