import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { EndGameCTA } from './EndGameCTA';

export const Game: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate game initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const saveGame = async () => {
    if (!user) return; // Don't save for anonymous users

    try {
      await addDoc(collection(db, 'games'), {
        userId: user.uid,
        score,
        tier: getTier(score),
        timestamp: new Date(),
      });
      navigate('/my-games');
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handleNewGame = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (gameOver) {
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