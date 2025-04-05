import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameCard {
  title: string;
  subtitle: string;
  status: 'LIVE' | 'COMING SOON';
  path: string;
  sport: string;
}

const GAME_CARDS: GameCard[] = [
  {
    title: 'NFL QB Wins Challenge',
    subtitle: '20 QBs, One Epic Journey to Greatness',
    status: 'LIVE',
    path: '/game',
    sport: 'NFL'
  },
  {
    title: 'NBA Points Challenge',
    subtitle: 'Get to 50000 Points in 20 Picks',
    status: 'COMING SOON',
    path: '/nba',
    sport: 'NBA'
  },
  {
    title: 'MLB Wins Challenge',
    subtitle: 'Get to 300 Wins in 20 Picks',
    status: 'COMING SOON',
    path: '/mlb',
    sport: 'MLB'
  },
  {
    title: 'Soccer Goals Challenge',
    subtitle: 'Get to 500 Goals in 20 Picks',
    status: 'COMING SOON',
    path: '/soccer',
    sport: 'Soccer'
  }
];

const SPORTS_TABS = ['NFL', 'NBA', 'MLB', 'Soccer', 'More'];

const GameCard = ({ game, isActive, onClick, shouldShowRules }: { 
  game: GameCard, 
  isActive: boolean, 
  onClick: () => void,
  shouldShowRules: boolean
}) => {
  const [showRules, setShowRules] = useState(shouldShowRules);

  useEffect(() => {
    setShowRules(shouldShowRules);
  }, [shouldShowRules]);

  return (
    <div className="relative">
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isActive ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'
        }`}
      >
        <div className="relative bg-gray-800">
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <img 
              src={`/images/${game.title.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{game.title}</h2>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  game.status === 'LIVE'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {game.status}
              </span>
            </div>
            <p className="text-gray-200 text-sm mb-4">{game.subtitle}</p>
            {game.title === 'NFL QB Wins Challenge' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Play Now
              </button>
            )}
          </div>
          {game.title === 'NFL QB Wins Challenge' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRules(!showRules);
              }}
              className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Rules
            </button>
          )}
        </div>
      </div>

      {/* Rules Overlay - Only for NFL QB game */}
      {showRules && game.title === 'NFL QB Wins Challenge' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="space-y-4">
              <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
              <p>Each quarterback can only be used once throughout the game.</p>
              <p>Type "help" to see available QBs for the current team.</p>
              <p>Your goal is to reach 2,500 total QB career wins.</p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Achievement Levels:</h3>
                <ul className="space-y-2">
                  <li>🏆 THE GOAT: 2500+ wins</li>
                  <li>🏈 Hall of Famer: 2451-2499 wins</li>
                  <li>🏆 SuperBowl MVP: 2401-2450 wins</li>
                  <li>🏈 SuperBowl Winner: 2351-2400 wins</li>
                  <li>🏆 NFL MVP: 2301-2350 wins</li>
                  <li>🏆 Heisman Trophy Winner: 2251-2300 wins</li>
                  <li>🥇 First Round Pick: 2176-2250 wins</li>
                  <li>🥈 Draft Pick: 2101-2175 wins</li>
                  <li>🥉 High School All-American: 2001-2100 wins</li>
                  <li>⭐ Division 1 Scholarship: 1901-2000 wins</li>
                  <li>⭐ College Walk-on: 1851-1900 wins</li>
                  <li>⭐ High School Team Captain: 1801-1850 wins</li>
                  <li>⭐ JV: 1751-1800 wins</li>
                  <li>⭐ Pop Warner: 1500-1750 wins</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('NFL');

  const filteredGames = GAME_CARDS.filter(game => game.sport === activeTab);

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
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
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

      {/* Game Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <div
              key={index}
            >
              <GameCard
                game={game}
                isActive={activeTab === game.sport}
                onClick={() => navigate(game.path)}
                shouldShowRules={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 