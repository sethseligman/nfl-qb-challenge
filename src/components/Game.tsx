import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { validateQB, formatQBDisplayName, findHighestScoringQB } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import LandingScreen from './LandingScreen';

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

export default function Game() {
  const { 
    currentRound, 
    currentTeam, 
    usedQBs, 
    picks, 
    totalScore, 
    isGameOver, 
    showScore,
    usedTeams,
    setCurrentTeam, 
    addPick, 
    resetGame,
    toggleScore 
  } = useGameStore();
  const [qbInput, setQbInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!currentTeam && !isGameOver && gameStarted) {
      const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
      setCurrentTeam(randomTeam);
    }
  }, [currentTeam, isGameOver, setCurrentTeam, gameStarted]);

  useEffect(() => {
    if (isGameOver) {
      setQbInput('');
    }
  }, [isGameOver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (qbInput.toLowerCase() === 'help') {
      if (!currentTeam) {
        setError('No team selected. Please wait for a team to be assigned.');
        setIsLoading(false);
        return;
      }

      const highestQB = findHighestScoringQB(currentTeam, usedQBs);
      if (!highestQB) {
        setError('No available QBs found for this team.');
        setIsLoading(false);
        return;
      }

      addPick(highestQB.name, highestQB.wins, highestQB.name);
      setQbInput('');
      setIsLoading(false);
      return;
    }

    if (usedQBs.includes(qbInput)) {
      setError('This QB has already been used!');
      setIsLoading(false);
      return;
    }

    if (!currentTeam) {
      setError('No team selected. Please wait for a team to be assigned.');
      setIsLoading(false);
      return;
    }

    const qbData = validateQB(qbInput, currentTeam);
    
    if (!qbData) {
      setError('This QB either does not exist in our database or did not play for this team.');
      setIsLoading(false);
      return;
    }

    addPick(qbData.name, qbData.wins, qbInput);
    setQbInput('');
    setIsLoading(false);
  };

  if (!gameStarted) {
    return <LandingScreen onStart={() => setGameStarted(true)} />;
  }

  if (isGameOver) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Game Over!</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Final Score: {totalScore}</h2>
          <p className="text-xl mb-6">Your Tier: {getTier(totalScore)}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {picks.map((pick, index) => (
              <div key={index} className="border rounded-lg p-3 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={getTeamLogo(pick.team)} 
                    alt={pick.team} 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img 
                    src={getQBPhoto(pick.qb) || ''} 
                    alt={pick.qb}
                    className="w-16 h-16 object-contain rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="text-center">
                    <div className="font-semibold">{formatQBDisplayName(pick.displayName, pick.qb)}</div>
                    {showScore && <div className="text-sm text-gray-600">{pick.wins} wins</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">NFL QB Wins Challenge</h1>
          <p className="text-gray-600">Round {currentRound} of 20</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            {currentTeam && (
              <>
                <img 
                  src={getTeamLogo(currentTeam)} 
                  alt={currentTeam} 
                  className="w-16 h-16 object-contain"
                />
                <h2 className="text-3xl font-bold text-blue-600">{currentTeam}</h2>
              </>
            )}
          </div>
          {showScore && <p className="text-xl mt-2">Current Score: {totalScore}</p>}
          <button
            onClick={toggleScore}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showScore ? 'Hide Scores' : 'Show Scores'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qb" className="block text-sm font-medium text-gray-700">
              Quarterback Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="qb"
                value={qbInput}
                onChange={(e) => setQbInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setQbInput('help')}
                className="mt-1 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                disabled={isLoading}
              >
                Help
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Submit'}
          </button>
        </form>

        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {picks.map((pick, index) => (
              <div key={index} className="border rounded-lg p-3 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={getTeamLogo(pick.team)} 
                    alt={pick.team} 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img 
                    src={getQBPhoto(pick.qb) || ''} 
                    alt={pick.qb}
                    className="w-16 h-16 object-contain rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="text-center">
                    <div className="font-semibold">{formatQBDisplayName(pick.displayName, pick.qb)}</div>
                    {showScore && <div className="text-sm text-gray-600">{pick.wins} wins</div>}
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