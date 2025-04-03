import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, qbDatabase, validateQB, normalizeTeamName } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import { teamColors } from '../data/teamColors';
import { ScoreHistory } from './ScoreHistory';

interface Score {
  id: string;
  date: string;
  totalScore: number;
  tier: string;
  picks: {
    qb: string;
    wins: number;
    displayName: string;
    team: string;
  }[];
}

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

const getTier = (score: number): string => {
  if (score < 2000) return "College Walk-On";
  if (score < 2200) return "Pop Warner";
  if (score < 2300) return "HS All-American";
  if (score < 2400) return "Draft Pick";
  if (score < 2500) return "Heisman Winner";
  return "GOAT";
};

export const Game: React.FC = () => {
  const {
    currentTeam,
    picks,
    isGameOver,
    showScore,
    toggleScore,
    usedQBs,
    addPick,
    setCurrentTeam,
    totalScore,
    initializeGame,
    resetGame,
    addScore
  } = useGameStore();

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTeam, setShufflingTeam] = useState<string | undefined>(undefined);

  // Calculate total score and current round
  const currentRound = picks.length + 1;

  useEffect(() => {
    // Initialize game state
    initializeGame();
    
    // Start shuffling animation
    setIsShuffling(true);
    
    // Set a new random team after animation
    setTimeout(() => {
      const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
      setCurrentTeam(randomTeam);
    }, 1500);
  }, []);

  // Add effect for shuffling animation
  useEffect(() => {
    if (isShuffling) {
      // Start with a faster interval for more rapid changes
      const fastInterval = setInterval(() => {
        const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
        setShufflingTeam(randomTeam);
      }, 50); // Change every 50ms for rapid shuffling

      // After 1 second, slow down the changes
      const slowDownTimeout = setTimeout(() => {
        clearInterval(fastInterval);
        const slowInterval = setInterval(() => {
          const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
          setShufflingTeam(randomTeam);
        }, 200); // Change every 200ms for slower shuffling

        // After 0.5 seconds, stop and show the final team
        const finalTimeout = setTimeout(() => {
          clearInterval(slowInterval);
          setIsShuffling(false);
          setShufflingTeam(undefined);
        }, 500);

        return () => {
          clearInterval(slowInterval);
          clearTimeout(finalTimeout);
        };
      }, 1000); // Changed from 1500 to 1000

      return () => {
        clearInterval(fastInterval);
        clearTimeout(slowDownTimeout);
      };
    }
  }, [isShuffling]);

  // Remove any effect that might be resetting showScore
  useEffect(() => {
    if (isGameOver) {
      setInput('');
    }
  }, [isGameOver]);

  const handleReset = () => {
    // Initialize game state
    initializeGame();
    
    // Start shuffling animation
    setIsShuffling(true);
    
    // Set a new random team after animation
    setTimeout(() => {
      const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
      setCurrentTeam(randomTeam);
    }, 1500);
    
    // Clear input and validation states
    setInput('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting QB:', input);
      console.log('Current team:', currentTeam);
      console.log('Used QBs:', usedQBs);

      // Check if input is 'help'
      if (input.toLowerCase().trim() === 'help') {
        // Find all available QBs for the current team
        const availableQBs = Object.entries(qbDatabase)
          .filter(([qbName, data]) => {
            const normalizedCurrentTeam = normalizeTeamName(currentTeam || '');
            const normalizedQbTeams = data.teams.map(normalizeTeamName);
            return normalizedQbTeams.includes(normalizedCurrentTeam) && !usedQBs.includes(qbName);
          })
          .map(([name, data]) => ({ name, wins: data.wins }));

        // Randomize the order of QBs
        for (let i = availableQBs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableQBs[i], availableQBs[j]] = [availableQBs[j], availableQBs[i]];
        }

        console.log('Available QBs:', availableQBs); // Debug log

        if (availableQBs.length > 0) {
          setAvailableQBs(availableQBs);
          setShowHelpDropdown(true);
          setIsLoading(false);
          return;
        } else {
          setError('No more QBs available for this team');
          return;
        }
      }

      // Validate the QB
      const validationResult = validateQB(input, currentTeam || '');
      console.log('Validation result:', validationResult);
      if (!validationResult) {
        setError('Invalid quarterback name');
        return;
      }

      const { name, wins } = validationResult;
      if (usedQBs.includes(name)) {
        setError('This quarterback has already been used');
        return;
      }

      // Format the display name properly
      const displayName = formatQBDisplayName(input, name);
      addPick(name, wins, displayName);
      
      // Start shuffling animation
      setIsShuffling(true);
      
      // Set a new random team after animation
      setTimeout(() => {
        const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
        setCurrentTeam(randomTeam);
      }, 1500);
      
      setInput('');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQBSelect = (qbName: string) => {
    setInput(qbName);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
  };

  const QBPhoto: React.FC<{ qb: string; size?: 'sm' | 'lg' }> = ({ qb, size = 'sm' }) => {
    const [showImage, setShowImage] = useState(true);
    const photoUrl = getQBPhoto(qb);

    if (!showImage || !photoUrl) {
      return (
        <div className={`flex items-center justify-center bg-gray-700 rounded-full ${
          size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
        }`}>
          <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-lg'}`}>
            {qb.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      );
    }

    return (
      <img
        src={photoUrl}
        alt={qb}
        className={`object-contain rounded-full ${
          size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
        }`}
        onError={() => setShowImage(false)}
      />
    );
  };

  const handleNewGame = () => {
    // Save the current game score if we have a team
    if (currentTeam && picks.length > 0) {
      const score: Score = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        totalScore,
        tier: getTier(totalScore),
        picks: [...picks]
      };
      addScore(score);
    }
    
    // Reset the game state
    resetGame();
    
    // Set a new random team
    const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    setCurrentTeam(randomTeam);
    
    // Clear input and validation states
    setInput('');
    setError(null);
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-blue-500">NFL QB Challenge</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRules(!showRules)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Rules
              </button>
              <button
                onClick={handleNewGame}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                New Game
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-xl p-6">
            <h2 className="text-4xl font-bold text-center mb-8 text-blue-500">Game Over!</h2>
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-emerald-500 mb-2">Final Score: {totalScore}</div>
              <div className="text-xl text-gray-300">Your Tier: {getTier(totalScore)}</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {picks.map((pick, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={getTeamLogo(pick.team)}
                      alt={pick.team}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <QBPhoto qb={pick.qb} size="lg" />
                    <div className="text-center">
                      <div className="font-semibold text-white">{pick.displayName}</div>
                      <div className="text-sm text-emerald-500">{pick.wins} wins</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-blue-500">NFL QB Challenge</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleScore}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors font-medium text-sm sm:text-base ${
                    showScore 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {showScore ? 'Hide Score' : 'Show Score'}
                </button>
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  Rules
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-white text-sm sm:text-base"
                >
                  New Game
                </button>
              </div>
            </div>

            {/* Rules Modal */}
            {showRules && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-500">How to Play</h2>
                    <button
                      onClick={() => setShowRules(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-gray-300 space-y-4">
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
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
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
                    <div className="h-[48px]"> {/* Placeholder with same height as team name */}
                      {!isShuffling && (
                        <h3 className={`text-4xl font-bold animate-slide-up ${teamColors[currentTeam || ''] || 'text-emerald-500'}`}>
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

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (e.target.value.toLowerCase().trim() !== 'help') {
                        setShowHelpDropdown(false);
                        setAvailableQBs([]);
                      }
                    }}
                    placeholder="Enter a Quarterback's Name"
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? '...' : 'Submit'}
                  </button>
                </div>

                {showHelpDropdown && availableQBs.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {availableQBs.map((qb) => (
                      <button
                        key={qb.name}
                        onClick={() => handleQBSelect(qb.name)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white flex justify-between items-center"
                      >
                        <span>{qb.name}</span>
                        {showScore && (
                          <span className="text-emerald-500">{qb.wins} wins</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="mt-2 text-sm text-red-400 animate-fade-in">
                    {error}
                  </p>
                )}
              </form>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">Round {currentRound} of 20</div>
                </div>
                {showScore && (
                  <div className="text-emerald-500 font-medium">Score: {totalScore}</div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:w-80 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6">
              {/* Picks History */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-300">Your Picks</h4>
                  <div className="text-lg font-bold text-blue-500">{picks.length}/20</div>
                </div>
                <div className="space-y-3">
                  {picks.map((pick, index) => (
                    <div key={index} className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
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
                        {showScore && (
                          <div className="text-xs text-emerald-500 mt-1">{pick.wins} wins</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <ScoreHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};