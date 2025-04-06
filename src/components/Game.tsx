import React, { useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { QBPhoto } from './QBPhoto';
import { ScoreHistory } from './ScoreHistory';
import { getTeamLogo } from '../utils/teamLogos';
import { teamColors } from '../utils/teamColors';
import { startGame } from '../utils/gameLogic';

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

const ACHIEVEMENT_LEVELS = [
  { tier: "GOAT", minScore: 2500, emoji: "🏆" },
  { tier: "Hall of Famer", minScore: 2451, maxScore: 2499, emoji: "🏈" },
  { tier: "SuperBowl MVP", minScore: 2401, maxScore: 2450, emoji: "🏆" },
  { tier: "SuperBowl Winner", minScore: 2351, maxScore: 2400, emoji: "🏈" },
  { tier: "NFL MVP", minScore: 2301, maxScore: 2350, emoji: "🏆" },
  { tier: "Heisman Trophy Winner", minScore: 2251, maxScore: 2300, emoji: "🏆" },
  { tier: "First Round Pick", minScore: 2176, maxScore: 2250, emoji: "🥇" },
  { tier: "Draft Pick", minScore: 2101, maxScore: 2175, emoji: "🥈" },
  { tier: "High School All-American", minScore: 2001, maxScore: 2100, emoji: "🥉" },
  { tier: "Division 1 Scholarship", minScore: 1901, maxScore: 2000, emoji: "⭐" },
  { tier: "College Walk-on", minScore: 1851, maxScore: 1900, emoji: "⭐" },
  { tier: "High School Team Captain", minScore: 1801, maxScore: 1850, emoji: "⭐" },
  { tier: "JV", minScore: 1751, maxScore: 1800, emoji: "⭐" },
  { tier: "Pop Warner", minScore: 0, maxScore: 1750, emoji: "⭐" }
];

const getAchievedTier = (score: number) => {
  return ACHIEVEMENT_LEVELS.find(level => 
    score >= level.minScore && (!level.maxScore || score <= level.maxScore)
  );
};

export const Game: React.FC = () => {
  const { currentTeam, picks, isGameOver, showScore, totalScore, setCurrentTeam, addPick, resetGame, setShowScore, initializeGame } = useGameStore();
  const [input, setInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [shufflingTeam] = useState<string | null>(null);
  const [isShuffling] = useState(false);
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
                {(currentTeam || shufflingTeam) ? (
                  <>
                    <img 
                      src={getTeamLogo(shufflingTeam || currentTeam || '')} 
                      alt={shufflingTeam || currentTeam || ''} 
                      className={`w-32 h-32 object-contain transition-all duration-100 ${
                        isShuffling 
                          ? 'animate-pulse-fast scale-110' 
                          : 'animate-pulse-slow'
                      }`}
                    />
                    <div className="h-[48px]">
                      {!isShuffling && (
                        <h3 className={`text-4xl font-bold animate-slide-up ${teamColors[currentTeam || ''] || 'text-emerald-500'} text-center whitespace-nowrap`}>
                          {currentTeam}
                        </h3>
                      )}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-6">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Welcome to the NFL QB Challenge! Test your knowledge of NFL quarterbacks and their teams.
              </p>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Game Rules:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You'll be shown an NFL team logo</li>
                  <li>Type the name of the quarterback who started the most games for that team in the 2023 season</li>
                  <li>You have 20 teams to guess</li>
                  <li>Each correct answer earns you points based on the QB's 2023 win total</li>
                  <li>Use the "Help" button if you need a hint (limited to 3 uses)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Scoring:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Correct answer: Points equal to the QB's 2023 win total</li>
                  <li>Using help: Half points (rounded down)</li>
                  <li>Maximum possible score: 200 points (if all QBs had 10 wins)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Achievements:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Bronze: 50+ points</li>
                  <li>Silver: 100+ points</li>
                  <li>Gold: 150+ points</li>
                  <li>Platinum: 200 points (perfect score)</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGotIt}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {gameStarted ? "Got it!" : "Play Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};