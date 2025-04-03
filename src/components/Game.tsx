import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { findClosestMatch, formatQBDisplayName, qbDatabase } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';

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
    setCurrentTeam,
    addPick,
    resetGame,
    setShowScore
  } = useGameStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'error' | 'success'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [showRules, setShowRules] = useState(false);

  // Calculate total score and current round
  const totalScore = picks.reduce((sum, pick) => sum + pick.wins, 0);
  const currentRound = picks.length + 1;

  useEffect(() => {
    // Start with a random team
    const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    setCurrentTeam(randomTeam);
  }, []);

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

  const handleReset = () => {
    resetGame();
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
      // Check if input is 'help'
      if (input.toLowerCase().trim() === 'help') {
        // Find the best available QB for the current team
        const bestQB = Object.entries(qbDatabase)
          .filter(([qbName, data]) => 
            data.teams.includes(currentTeam || '') && 
            !usedQBs.includes(qbName)
          )
          .sort((a, b) => b[1].wins - a[1].wins)[0];

        if (bestQB) {
          setInput(bestQB[0]);
          setValidationState('success');
          setValidationMessage('Best available QB selected! Click submit to use them.');
          setIsLoading(false);
          return;
        } else {
          setError('No more QBs available for this team');
          setValidationState('error');
          setValidationMessage('No more QBs available for this team');
          return;
        }
      }

      const result = validateQB(input);
      if (!result) {
        setError('Invalid quarterback name');
        setValidationState('error');
        setValidationMessage('Invalid quarterback name');
        return;
      }

      const { qb, wins } = result;
      if (usedQBs.includes(qb)) {
        setError('This quarterback has already been used');
        setValidationState('error');
        setValidationMessage('This quarterback has already been used');
        return;
      }

      // Format the display name properly
      const displayName = formatQBDisplayName(input, qb);
      addPick(qb, wins, displayName);
      
      // Set a new random team
      const usedTeams = [...picks.map(pick => pick.team), currentTeam || ''];
      const availableTeams = NFL_TEAMS.filter(team => !usedTeams.includes(team));
      if (availableTeams.length > 0) {
        const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        setCurrentTeam(randomTeam);
      }
      
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowRules(!showRules)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              Rules
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
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