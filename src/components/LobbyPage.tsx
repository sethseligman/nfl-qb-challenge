import React from 'react';
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

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('NFL');

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
              className="relative group"
            >
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-4">
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
                <p className="text-gray-400 mb-6">{game.subtitle}</p>
                <button
                  onClick={() => navigate(game.path)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  Play Now
                </button>
              </div>

              {/* Rules Popup */}
              {game.title === 'NFL QB Wins Challenge' && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-gray-800 rounded-xl shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <h3 className="text-lg font-semibold text-blue-500 mb-2">How to Play</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Teams are randomly selected and can appear multiple times</li>
                    <li>• Enter a QB that played at least 1 game for that team</li>
                    <li>• Each QB can only be used once</li>
                    <li>• Type "help" to get a suggestion for the best available QB</li>
                    <li>• The game ends after 20 picks</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-blue-500 mt-4 mb-2">Achievement Levels</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• 🏆 THE GOAT: 2500+ wins</li>
                    <li>• 🏈 Hall of Famer: 2451-2499 wins</li>
                    <li>• 🏆 SuperBowl MVP: 2401-2450 wins</li>
                    <li>• 🏈 SuperBowl Winner: 2351-2400 wins</li>
                    <li>• 🏆 NFL MVP: 2301-2350 wins</li>
                    <li>• 🏆 Heisman Trophy Winner: 2251-2300 wins</li>
                    <li>• 🥇 First Round Pick: 2176-2250 wins</li>
                    <li>• 🥈 Draft Pick: 2101-2175 wins</li>
                    <li>• 🥉 High School All-American: 2001-2100 wins</li>
                    <li>• ⭐ Division 1 Scholarship: 1901-2000 wins</li>
                    <li>• ⭐ College Walk-on: 1851-1900 wins</li>
                    <li>• ⭐ High School Team Captain: 1801-1850 wins</li>
                    <li>• ⭐ JV: 1751-1800 wins</li>
                    <li>• ⭐ Pop Warner: 1500-1750 wins</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 