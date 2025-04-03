import React, { useState } from 'react';
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

const GameCard = ({ game, isActive, onClick, isMobile }: { 
  game: GameCard, 
  isActive: boolean, 
  onClick: () => void,
  isMobile: boolean 
}) => {
  const [showRules, setShowRules] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isActive ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
            <button
              onClick={onClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Play Now
            </button>
          </div>
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
              className={`absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium cursor-help transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setShowRules(true)}
              onMouseLeave={() => setShowRules(false)}
            >
              Rules
            </div>
          )}
        </div>
      </div>

      {/* Rules Modal - Moved outside the card */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-500">How to Play</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRules(false);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-300 space-y-4">
              {game.sport === 'NFL' && (
                <>
                  <p>
                    Test your NFL knowledge by predicting the winner of each game. 
                    Make your picks before kickoff and earn points for correct predictions. 
                    The more confident you are, the more points you can earn!
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500 mb-2">Achievement Levels</h3>
                    <ul className="space-y-2 text-sm">
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
                </>
              )}
              {game.sport === 'NBA' && (
                <>
                  <p>
                    Test your NBA knowledge by predicting the winner of each game. 
                    Make your picks before tip-off and earn points for correct predictions. 
                    The more confident you are, the more points you can earn!
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500 mb-2">Achievement Levels</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• 🏀 GOAT: 50000+ points</li>
                      <li>• 🏆 NBA Champion: 45000-49999 points</li>
                      <li>• 🏀 Finals MVP: 40000-44999 points</li>
                      <li>• 🏆 League MVP: 35000-39999 points</li>
                      <li>• 🏀 All-Star: 30000-34999 points</li>
                      <li>• 🏆 Sixth Man: 25000-29999 points</li>
                      <li>• 🏀 Role Player: 20000-24999 points</li>
                      <li>• 🏆 Bench Player: 15000-19999 points</li>
                      <li>• 🏀 G-League: 10000-14999 points</li>
                      <li>• 🏆 College Player: 5000-9999 points</li>
                      <li>• 🏀 High School Star: 1000-4999 points</li>
                      <li>• 🏆 Rec League: 0-999 points</li>
                    </ul>
                  </div>
                </>
              )}
              {game.sport === 'MLB' && (
                <>
                  <p>
                    Test your MLB knowledge by predicting the winner of each game. 
                    Make your picks before first pitch and earn points for correct predictions. 
                    The more confident you are, the more points you can earn!
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500 mb-2">Achievement Levels</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• ⚾ Hall of Famer: 300+ wins</li>
                      <li>• 🏆 Cy Young Winner: 250-299 wins</li>
                      <li>• ⚾ All-Star: 200-249 wins</li>
                      <li>• 🏆 Starting Pitcher: 150-199 wins</li>
                      <li>• ⚾ Relief Pitcher: 100-149 wins</li>
                      <li>• 🏆 Minor League: 50-99 wins</li>
                      <li>• ⚾ College Pitcher: 25-49 wins</li>
                      <li>• 🏆 High School Star: 10-24 wins</li>
                      <li>• ⚾ Little League: 0-9 wins</li>
                    </ul>
                  </div>
                </>
              )}
              {game.sport === 'Soccer' && (
                <>
                  <p>
                    Test your Soccer knowledge by predicting the winner of each game. 
                    Make your picks before kickoff and earn points for correct predictions. 
                    The more confident you are, the more points you can earn!
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-500 mb-2">Achievement Levels</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• ⚽ World Cup Winner: 500+ goals</li>
                      <li>• 🏆 Champions League: 450-499 goals</li>
                      <li>• ⚽ Premier League: 400-449 goals</li>
                      <li>• 🏆 La Liga: 350-399 goals</li>
                      <li>• ⚽ Bundesliga: 300-349 goals</li>
                      <li>• 🏆 Serie A: 250-299 goals</li>
                      <li>• ⚽ Ligue 1: 200-249 goals</li>
                      <li>• 🏆 Championship: 150-199 goals</li>
                      <li>• ⚽ League One: 100-149 goals</li>
                      <li>• 🏆 League Two: 50-99 goals</li>
                      <li>• ⚽ Non-League: 25-49 goals</li>
                      <li>• 🏆 Sunday League: 0-24 goals</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('NFL');
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 