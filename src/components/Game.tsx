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
                    const usedHelpInGame = usedHelp.some(used => used);
                    return (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${
                          isAchieved
                            ? 'bg-blue-500 border-2 border-blue-400 animate-pulse'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between min-h-[32px]">
                          <div className="flex items-center">
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
                          {isAchieved && usedHelpInGame && (
                            <span className="text-2xl ml-2">🆘</span>
                          )}
                        </div>
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-md">
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold text-white mb-2">Current Team</h2>
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={getTeamLogo(currentTeam || '')}
                  alt={currentTeam || ''}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-2xl font-bold text-white">{currentTeam}</span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-2">Enter Quarterback</h2>
              <div className="flex flex-col space-y-4">
                <div className="relative">
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
                    placeholder="Type QB name or 'help'"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      isValidInput === true
                        ? 'focus:ring-green-500'
                        : isValidInput === false
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                  />
                  {error && (
                    <p className="mt-2 text-red-500 text-sm">{error}</p>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-2">Game Progress</h2>
              <div className="space-y-2">
                {picks.map((pick, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-600 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={getTeamLogo(pick.team)}
                        alt={pick.team}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-white">{pick.displayName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {usedHelp[index] && <span className="text-2xl">🆘</span>}
                      {showScore && <span className="text-emerald-500">{pick.wins} wins</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};