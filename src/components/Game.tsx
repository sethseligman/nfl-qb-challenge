import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { EndGameCTA } from './EndGameCTA';
import { useGameStore } from '../store/gameStore';
import { qbDatabase } from '../data/qbData';

export const Game: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    currentTeam,
    picks,
    isGameOver,
    totalScore,
    resetGame,
    initializeGame,
    addPick
  } = useGameStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  console.log('Game: Rendering with state:', {
    user: user ? 'authenticated' : 'anonymous',
    authLoading,
    currentTeam,
    picks,
    totalScore,
    isGameOver
  });

  useEffect(() => {
    console.log('Game: Initializing');
    if (!currentTeam) {
      initializeGame();
    }
    setIsInitializing(false);
  }, [currentTeam, initializeGame]);

  const saveGame = async () => {
    if (!user) {
      console.log('Game: Attempted to save game as anonymous user');
      return;
    }

    console.log('Game: Saving game for user:', user.uid);
    try {
      await addDoc(collection(db, 'games'), {
        userId: user.uid,
        date: new Date(),
        totalScore,
        tier: getTier(totalScore),
        picks: picks.map(pick => ({
          team: pick.team,
          qb: pick.qb,
          wins: pick.wins
        }))
      });
      console.log('Game: Successfully saved game');
      navigate('/my-games');
    } catch (error) {
      console.error('Game: Error saving game:', error);
    }
  };

  const handleNewGame = async () => {
    console.log('Game: Starting new game');
    if (user) {
      await saveGame();
    }
    resetGame();
    initializeGame();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const qb = qbDatabase[inputValue];
    if (!qb) {
      setError('Invalid QB name. Please try again.');
      return;
    }

    if (picks.some(pick => pick.qb === qb.name)) {
      setError('This QB has already been used. Please choose another.');
      return;
    }

    addPick(qb.name, qb.wins, qb.name);
    setInputValue('');
  };

  const getTier = (score: number): string => {
    if (score >= 2500) return '🏆 THE GOAT';
    if (score >= 2451) return '🏈 Hall of Famer';
    if (score >= 2401) return '🏆 SuperBowl MVP';
    if (score >= 2351) return '🏈 SuperBowl Winner';
    if (score >= 2301) return '🏆 NFL MVP';
    if (score >= 2251) return '🏆 Heisman Trophy Winner';
    if (score >= 2176) return '🥇 First Round Pick';
    if (score >= 2101) return '🥈 Draft Pick';
    if (score >= 2001) return '🥉 High School All-American';
    if (score >= 1901) return '⭐ Division 1 Scholarship';
    if (score >= 1851) return '⭐ College Walk-on';
    if (score >= 1801) return '⭐ High School Team Captain';
    if (score >= 1751) return '⭐ JV';
    return '⭐ Pop Warner';
  };

  // Show loading state while auth or game is initializing
  if (isInitializing || authLoading) {
    console.log('Game: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isGameOver) {
    console.log('Game: Showing game over screen');
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Final Score: {totalScore}</p>
        <p className="text-xl mb-4">Tier: {getTier(totalScore)}</p>
        {user ? (
          <button
            onClick={saveGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Score
          </button>
        ) : (
          <EndGameCTA onSaveGame={() => navigate('/login')} />
        )}
        <button
          onClick={handleNewGame}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Game
        </button>
      </div>
    );
  }

  console.log('Game: Rendering game UI');
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((picks.length + 1) / 20) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Current Team: {currentTeam}</h3>
        <div className="space-y-4">
          {picks.map((pick, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium">{pick.team}:</span>
              <span>{pick.qb} ({pick.wins} wins)</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="qb-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter QB Name
          </label>
          <input
            id="qb-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter QB name..."
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};