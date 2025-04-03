import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { findClosestMatch, formatQBDisplayName, qbDatabase } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import LandingScreen from './LandingScreen';

interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
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
    usedQBs,
    showHelp,
    setCurrentTeam,
    addPick,
    resetGame,
    setShowScore,
    setShowHelp
  } = useGameStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'error' | 'success'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  // Calculate total score and current round
  const totalScore = picks.reduce((sum, pick) => sum + pick.wins, 0);
  const currentRound = picks.length + 1;

  useEffect(() => {
    if (!currentTeam && !isGameOver && gameStarted) {
      // Get teams that haven't been used yet
      const usedTeams = picks.map(pick => pick.team);
      const availableTeams = NFL_TEAMS.filter(team => !usedTeams.includes(team));
      
      if (availableTeams.length > 0) {
        const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        setCurrentTeam(randomTeam);
      }
    }
  }, [currentTeam, isGameOver, setCurrentTeam, gameStarted, picks]);

  useEffect(() => {
    if (isGameOver) {
      setInput('');
      setShowScore(true);
    } else {
      setShowScore(false);
    }
  }, [isGameOver, setShowScore]);

  // Add timeout cleanup for validation messages
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (validationState !== 'idle') {
      timeout = setTimeout(() => {
        setValidationState('idle');
        setValidationMessage('');
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [validationState]);

  // Add help timeout
  useEffect(() => {
    if (showHelp) {
      const timeout = setTimeout(() => {
        setShowHelp(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showHelp]);

  const handleReset = () => {
    resetGame();
    setGameStarted(false);
    setInput('');
    setError(null);
    setValidationState('idle');
    setValidationMessage('');
  };

  const validateQB = (input: string): { isValid: boolean; qb: string; wins: number; displayName: string } | null => {
    const result = findClosestMatch(input);
    if (!result) return null;

    const qbData = qbDatabase[result];
    if (!qbData) return null;

    // Check if the QB played for the current team
    if (!qbData.teams.includes(currentTeam || '')) {
      return null;
    }

    // Get the display name based on the input and full name
    const displayName = formatQBDisplayName(input, result);
    return { isValid: true, qb: result, wins: qbData.wins, displayName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationState('idle');
    setValidationMessage('');

    try {
      const result = validateQB(input);
      if (!result) {
        setError('Invalid quarterback name');
        setValidationState('error');
        setValidationMessage('Invalid quarterback name');
        return;
      }

      const { qb, wins, displayName } = result;
      if (usedQBs.includes(qb)) {
        setError('This quarterback has already been used');
        setValidationState('error');
        setValidationMessage('This quarterback has already been used');
        return;
      }

      addPick(qb, wins, displayName);
      setInput('');
      setValidationState('success');
      setValidationMessage('✔️ QB Accepted');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setValidationState('error');
      setValidationMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  if (!gameStarted) {
    return <LandingScreen onStart={() => {
      setGameStarted(true);
      setShowHelp(true);
    }} />;
  }

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-blue-500">NFL QB Challenge</h1>
            <button
              onClick={handleReset}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Play Again
            </button>
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">NFL QB Challenge</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>

        {/* Help Message */}
        {showHelp && (
          <div className="mb-6 p-4 bg-blue-900/50 rounded-lg border border-blue-500/50 animate-fade-in">
            <p className="text-blue-200">
              Enter the quarterback's name who played for the displayed team. 
              You can use first name, last name, or nickname. 
              Each QB can only be used once. 
              The game ends after 20 picks or when you can't find any more QBs.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main game content */}
          <div className="flex-1">
            {currentTeam && (
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={getTeamLogo(currentTeam)} 
                    alt={currentTeam} 
                    className="w-32 h-32 object-contain animate-pulse-slow"
                  />
                  <h3 className="text-4xl font-bold text-emerald-500 animate-slide-up">{currentTeam}</h3>
                </div>
              </div>
            )}

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="qb"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setError(null);
                        setValidationState('idle');
                        setValidationMessage('');
                      }}
                      className={`flex-1 bg-gray-700/50 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        validationState === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : validationState === 'success'
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-gray-600 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="Enter QB name..."
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || validationState === 'error'}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-400 animate-fade-in">
                      {error}
                    </p>
                  )}
                  {validationState !== 'idle' && !error && (
                    <p className={`mt-2 text-sm animate-fade-in ${
                      validationState === 'error' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {validationMessage}
                    </p>
                  )}
                </div>
              </form>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-400">Round {currentRound} of 20</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}; 