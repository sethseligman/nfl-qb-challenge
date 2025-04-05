import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, qbDatabase, validateQB, normalizeTeamName } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import { teamColors } from '../data/teamColors';
import { ScoreHistory } from './ScoreHistory';

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
    setIsGameOver
  } = useGameStore();

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTeam, setShufflingTeam] = useState<string | undefined>(undefined);
  const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
  const [isHelpCommand, setIsHelpCommand] = useState(false);
  const [usedHelp, setUsedHelp] = useState<boolean[]>([]);
  const [showPicks, setShowPicks] = useState(false);
  const achievementListRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isGameOver && !showPicks && achievementListRef.current) {
      const achievedTier = getAchievedTier(totalScore);
      if (achievedTier) {
        const tierIndex = ACHIEVEMENT_LEVELS.findIndex(level => level === achievedTier);
        if (tierIndex !== -1) {
          const tierElement = achievementListRef.current.children[tierIndex] as HTMLElement;
          if (tierElement) {
            tierElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  }, [isGameOver, showPicks, totalScore]);

  const handleReset = () => {
    // Initialize game state
    initializeGame();
    
    // Reset showPicks to false to show achievement tiers
    setShowPicks(false);
    
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
    setIsValidInput(null);
    setIsHelpCommand(false);
    setUsedHelp([]); // Reset usedHelp array
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
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

        if (availableQBs.length > 0) {
          setAvailableQBs(availableQBs);
          setShowHelpDropdown(true);
          setIsLoading(false);
          return;
        } else {
          setError('No more QBs available for this team');
          setIsValidInput(false);
          return;
        }
      }

      // Since we're validating in real-time, we can assume the input is valid if we get here
      const validationResult = validateQB(input, currentTeam || '');
      if (!validationResult || usedQBs.includes(validationResult.name)) {
        setIsValidInput(false);
        setError('Invalid quarterback name');
        return;
      }

      const { name, wins } = validationResult;
      
      // Format the display name properly
      const displayName = formatQBDisplayName(input, name);
      addPick(name, wins, displayName);
      
      // Add whether help was used to the usedHelp array
      setUsedHelp(prev => [...prev, isHelpCommand]);
      
      // Clear input and validation states
      setInput('');
      setIsValidInput(null);
      setIsHelpCommand(false);
      
      // TEMPORARY: End game after 1 pick for testing
      setIsGameOver(true);
      return;
      
      // Start shuffling animation
      setIsShuffling(true);
      
      // Set a new random team after animation
      setTimeout(() => {
        const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
        setCurrentTeam(randomTeam);
      }, 1500);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('An error occurred. Please try again.');
      setIsValidInput(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQBSelect = (qbName: string) => {
    setInput(qbName);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    // Set isHelpCommand to true since this QB was selected from help
    setIsHelpCommand(true);
    // Validate the selected QB
    const validationResult = validateQB(qbName, currentTeam || '');
    const isValid = validationResult && !usedQBs.includes(validationResult.name);
    setIsValidInput(isValid);
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

  if (isGameOver) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          touchAction: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onTouchMove={(e) => e.preventDefault()}
      >
        <div 
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          style={{ 
            maxHeight: '85vh',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            position: 'relative',
            zIndex: 1
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Game Over!</h2>
          <div className="text-center mb-4">
            <p className="text-xl text-gray-300">Your final score: <span className="font-bold text-emerald-500">{totalScore}</span></p>
            {!showPicks && (
              <>
                <p className="text-lg mt-2 text-gray-300">Achievement Level:</p>
                <div 
                  ref={achievementListRef}
                  className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y'
                  }}
                >
                  {ACHIEVEMENT_LEVELS.map((level, index) => {
                    const isAchieved = getAchievedTier(totalScore) === level;
                    return (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${
                          isAchieved
                            ? 'bg-blue-500 border-2 border-blue-400 animate-pulse'
                            : 'bg-gray-700'
                        }`}
                      >
                        <span className={`text-lg ${isAchieved ? 'text-white' : 'text-gray-300'}`}>
                          {level.emoji} {level.tier}
                        </span>
                        {level.maxScore ? (
                          <span className={`text-sm ml-2 ${isAchieved ? 'text-white' : 'text-gray-400'}`}>
                            ({level.minScore}-{level.maxScore} wins)
                          </span>
                        ) : (
                          <span className={`text-sm ml-2 ${isAchieved ? 'text-white' : 'text-gray-400'}`}>
                            ({level.minScore}+ wins)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {showPicks && (
              <div 
                className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
                }}
              >
                {picks.map((pick, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={getTeamLogo(pick.team)}
                          alt={pick.team}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-white font-medium">{pick.displayName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usedHelp[index] && <span className="text-2xl">🆘</span>}
                        <span className="text-emerald-500">{pick.wins} wins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPicks(!showPicks)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {showPicks ? 'View Achievement Levels' : 'View My Picks'}
            </button>
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
              <div 
                className="fixed inset-0 z-50"
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }}
                onClick={() => setShowRules(false)}
              >
                <div 
                  className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 my-4"
                  style={{ 
                    maxHeight: '90vh',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold mb-4 text-white">How to Play</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
                    <p>Each quarterback can only be used once throughout the game.</p>
                    <p>Type "help" to see available QBs for the current team.</p>
                    <p>Your goal is to reach 2,500 total QB career wins.</p>
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
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setInput(newValue);
                        if (newValue.toLowerCase().trim() === 'help') {
                          setShowHelpDropdown(false);
                          setAvailableQBs([]);
                          setIsValidInput(null);
                          setIsHelpCommand(true);
                          return;
                        }
                        
                        setIsHelpCommand(false);
                        // Validate input in real-time
                        if (newValue.trim() === '') {
                          setIsValidInput(null);
                        } else {
                          const validationResult = validateQB(newValue, currentTeam || '');
                          const isValid = validationResult && !usedQBs.includes(validationResult.name);
                          setIsValidInput(isValid);
                        }
                        
                        setShowHelpDropdown(false);
                        setAvailableQBs([]);
                      }}
                      placeholder="Enter a Quarterback's Name"
                      className={`w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                        isValidInput === null 
                          ? 'focus:ring-blue-500' 
                          : isValidInput 
                            ? 'focus:ring-green-500 ring-2 ring-green-500' 
                            : 'focus:ring-red-500 ring-2 ring-red-500'
                      }`}
                      disabled={isLoading}
                    />
                    {isValidInput && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || (!isValidInput && !isHelpCommand)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="flex items-center gap-2">
                          {usedHelp[index] && <span className="text-2xl">🆘</span>}
                          {showScore && <div className="text-xs text-emerald-500">{pick.wins} wins</div>}
                        </div>
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