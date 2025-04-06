import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { QBPhoto } from './QBPhoto';
import { ScoreHistory } from './ScoreHistory';
import { getTeamLogo } from '../utils/teamLogos';
import { teamColors } from '../utils/teamColors';
import { startGame } from '../utils/gameLogic';
import { RulesModal } from './RulesModal';

const NFL_TEAMS = [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders"
];

export const Game: React.FC = () => {
  const { currentTeam, picks, isGameOver, showScore, totalScore, setCurrentTeam, addPick, resetGame, setShowScore, initializeGame } = useGameStore();
  const [input, setInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setIsValidInput(value.trim().length > 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidInput || !currentTeam) return;

    // Add pick to history
    addPick(input, 0, input); // We'll update the wins later

    // Clear input
    setInput('');
    setIsValidInput(false);

    // Move to next team
    const currentIndex = NFL_TEAMS.indexOf(currentTeam);
    const nextIndex = (currentIndex + 1) % NFL_TEAMS.length;
    setCurrentTeam(NFL_TEAMS[nextIndex]);
  };

  const handleGotIt = () => {
    if (!gameStarted) {
      setGameStarted(true);
      initializeGame();
      startGame();
    }
    setShowRules(false);
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Game Over!</h1>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Final Score: {totalScore}</h2>
            <div className="space-y-4">
              {picks.map((pick, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img src={getTeamLogo(pick.team)} alt={pick.team} className="w-8 h-8" />
                  <div className="flex-1">
                    <div className="font-medium">{pick.displayName}</div>
                    <div className="text-sm text-gray-400">{pick.team}</div>
                  </div>
                  <div className="text-emerald-500">{pick.wins} wins</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                resetGame();
                setGameStarted(false);
                setShowRules(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => setShowScore(!showScore)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {showScore ? 'Hide Scores' : 'Show Scores'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">NFL QB Challenge</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowRules(true)}
              className="bg-blue-600/20 text-white px-4 py-1.5 rounded-full hover:bg-blue-600/30 transition-colors text-sm"
            >
              Rules
            </button>
            <button
              onClick={() => setShowScore(!showScore)}
              className="bg-blue-600/20 text-white px-4 py-1.5 rounded-full hover:bg-blue-600/30 transition-colors text-sm"
            >
              {showScore ? 'Hide Scores' : 'Show Scores'}
            </button>
            <button
              onClick={() => {
                resetGame();
                setGameStarted(false);
                setShowRules(true);
              }}
              className="bg-blue-600/20 text-white px-4 py-1.5 rounded-full hover:bg-blue-600/30 transition-colors text-sm"
            >
              New Game
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Team and Input */}
          <div className="flex-1">
            <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6 transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
              <div className="flex flex-col items-center gap-4">
                {currentTeam ? (
                  <>
                    <img 
                      src={getTeamLogo(currentTeam)} 
                      alt={currentTeam} 
                      className="w-32 h-32 object-contain transition-all duration-100 animate-pulse-slow"
                    />
                    <div className="h-[48px]">
                      <h3 className={`text-4xl font-bold animate-slide-up ${teamColors[currentTeam] || 'text-emerald-500'} text-center whitespace-nowrap`}>
                        {currentTeam}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="w-32 h-32 bg-gray-700 rounded-lg animate-pulse" />
                )}
              </div>
            </div>

            <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm rounded-xl shadow-xl p-6">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter quarterback name..."
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!isValidInput}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Picks and Score History */}
          <div className="lg:w-80 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6">
              {/* Picks History */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-300">Your Picks</h4>
                  <div className="text-lg font-bold text-blue-500">{picks.length}/20</div>
                </div>
                <div className="space-y-3">
                  {picks.map((pick, index) => (
                    <div key={index} className="bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={getTeamLogo(pick.team)}
                          alt={pick.team}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <QBPhoto qb={pick.qb} size="sm" />
                          <div className="text-sm font-medium text-white truncate">{pick.displayName}</div>
                        </div>
                        <div className="text-xs text-gray-400 truncate">{pick.team}</div>
                        <div className="flex items-center gap-2">
                          {pick.usedHelp && <span className="text-2xl">🆘</span>}
                          {showScore && <div className="text-xs text-emerald-500">{pick.wins} wins</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Score History Box */}
            <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm rounded-xl shadow-xl p-6">
              <ScoreHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <RulesModal onClose={handleGotIt} />
      )}
    </div>
  );
};