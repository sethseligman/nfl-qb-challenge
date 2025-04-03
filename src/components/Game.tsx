import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { qbDatabase } from '../data/qbDatabase';
import { getTier } from '../utils/tierCalculator';

export const Game: React.FC = () => {
  const { picks, currentTeam, totalScore, addPick, resetGame } = useGameStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (picks.length === 0) {
      resetGame();
    }
  }, [resetGame, picks.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qb = inputValue.trim();
    if (!qb) {
      setError('Please enter a QB name');
      return;
    }

    // Check if QB exists in database (case-insensitive)
    const qbData = qbDatabase.find(q => 
      q.name.toLowerCase() === qb.toLowerCase()
    );

    if (!qbData) {
      setError('QB not found in database');
      return;
    }

    // Check if QB has played for the current team (case-insensitive)
    if (!qbData.teams.some(team => 
      team.toLowerCase() === currentTeam.toLowerCase()
    )) {
      setError(`${qb} has never played for ${currentTeam}`);
      return;
    }

    // Check if QB has already been used (case-insensitive)
    if (picks.some(pick => 
      pick.qb.toLowerCase() === qb.toLowerCase()
    )) {
      setError('This QB has already been used');
      return;
    }

    addPick(currentTeam, qb, qbData.wins);
    setInputValue('');
    setError('');

    if (picks.length + 1 >= 20) {
      setIsGameOver(true);
    }
  };

  const handleNewGame = () => {
    resetGame();
    setIsGameOver(false);
  };

  if (isGameOver) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Game Over!</h2>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <p className="text-2xl mb-2 text-white">Final Score: {totalScore}</p>
          <p className="text-xl text-blue-400">Tier: {getTier(totalScore)}</p>
        </div>
        <button
          onClick={handleNewGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          New Game
        </button>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">How to Play</h2>
          <div className="space-y-4 text-gray-300">
            <p>Test your NFL knowledge by naming quarterbacks for each team. Each QB can only be used once, and you'll get points based on their career wins.</p>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Rules:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Each round, you'll see a random NFL team</li>
                <li>Enter a QB who has played for that team</li>
                <li>Points are based on the QB's career wins</li>
                <li>Each QB can only be used once</li>
                <li>Play until you've made 20 picks</li>
                <li>Try to reach 2,500 total wins!</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Achievement Levels:</h3>
              <ul className="space-y-1 text-sm">
                <li>🏆 THE GOAT: 2500+ wins</li>
                <li>🏈 Hall of Famer: 2451-2499 wins</li>
                <li>🏆 SuperBowl MVP: 2401-2450 wins</li>
                <li>🏈 SuperBowl Winner: 2351-2400 wins</li>
                <li>🏆 NFL MVP: 2301-2350 wins</li>
                <li>🏆 Heisman Trophy Winner: 2251-2300 wins</li>
                <li>🥇 First Round Pick: 2176-2250 wins</li>
                <li>🥈 Draft Pick: 2101-2175 wins</li>
                <li>🥉 High School All-American: 2001-2100 wins</li>
                <li>⭐ Division 1 Scholarship: 1901-2000 wins</li>
                <li>⭐ College Walk-on: 1851-1900 wins</li>
                <li>⭐ High School Team Captain: 1801-1850 wins</li>
                <li>⭐ JV: 1751-1800 wins</li>
                <li>⭐ Pop Warner: 1500-1750 wins</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((picks.length + 1) / 20) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Round {picks.length + 1} of 20
        </p>
      </div>

      {/* Current Team and Picks */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-white">Current Team: {currentTeam}</h3>
        <div className="space-y-2">
          {picks.map((pick, index) => (
            <div key={index} className="flex items-center justify-between text-gray-300">
              <span className="font-medium">{pick.team}:</span>
              <span>{pick.qb} ({pick.wins} wins)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="qb-input" className="block text-sm font-medium text-gray-300 mb-2">
            Enter QB Name
          </label>
          <input
            id="qb-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter QB name..."
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};