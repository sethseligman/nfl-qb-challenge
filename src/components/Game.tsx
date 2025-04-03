import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { EndGameCTA } from './EndGameCTA';

export const Game: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  console.log('Game: Rendering with state:', {
    user: user ? 'authenticated' : 'anonymous',
    authLoading,
    currentRound,
    score,
    gameOver
  });

  useEffect(() => {
    console.log('Game: Initializing');
    // Simulate game initialization
    setTimeout(() => {
      console.log('Game: Initialization complete');
      setIsInitializing(false);
    }, 1000);
  }, []);

  const saveGame = async () => {
    if (!user) {
      console.log('Game: Attempted to save game as anonymous user');
      return;
    }

    console.log('Game: Saving game for user:', user.uid);
    try {
      await addDoc(collection(db, 'games'), {
        userId: user.uid,
        score,
        tier: getTier(score),
        timestamp: new Date(),
      });
      console.log('Game: Successfully saved game');
      navigate('/my-games');
    } catch (error) {
      console.error('Game: Error saving game:', error);
    }
  };

  const handleNewGame = () => {
    console.log('Game: Starting new game');
    setCurrentRound(1);
    setScore(0);
    setGameOver(false);
  };

  const getTier = (score: number): string => {
    if (score >= 90) return 'Elite';
    if (score >= 80) return 'Pro';
    if (score >= 70) return 'All-Star';
    if (score >= 60) return 'Rookie';
    return 'Amateur';
  };

  if (isInitializing) {
    console.log('Game: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (gameOver) {
    console.log('Game: Showing game over screen');
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Final Score: {score}</p>
        <p className="text-xl mb-4">Tier: {getTier(score)}</p>
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
            style={{ width: `${(currentRound / 10) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Round {currentRound}</h2>
        <p className="text-xl mb-4">Current Score: {score}</p>
        <div className="space-x-4">
          <button
            onClick={() => setCurrentRound(prev => prev + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Higher
          </button>
          <button
            onClick={() => setCurrentRound(prev => prev + 1)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Lower
          </button>
        </div>
      </div>
    </div>
  );
};