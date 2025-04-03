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

const GameCard = ({ game, isActive, onClick }: { game: GameCard, isActive: boolean, onClick: () => void }) => {
  const [showRules, setShowRules] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isActive ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={`/images/${game.title.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        {game.title === 'NFL QB Wins Challenge' && (
          <>
            {isMobile ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRules(!showRules);
                }}
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Rules
              </button>
            ) : (
              <div 
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium cursor-help"
                onMouseEnter={() => setShowRules(true)}
                onMouseLeave={() => setShowRules(false)}
              >
                Rules
              </div>
            )}
            {showRules && (
              <div className={`absolute z-50 bg-gray-800 p-4 rounded-lg shadow-xl max-w-sm ${
                isMobile ? 'top-16 right-2' : 'top-12 right-2'
              }`}>
                <div className="text-white">
                  <h3 className="text-lg font-semibold text-blue-500 mb-2">How to Play</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Test your NFL knowledge by predicting the winner of each game. 
                    Make your picks before kickoff and earn points for correct predictions. 
                    The more confident you are, the more points you can earn!
                  </p>
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
                {isMobile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRules(false);
                    }}
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

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
            <GameCard
              key={index}
              game={game}
              isActive={activeTab === game.sport}
              onClick={() => navigate(game.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 