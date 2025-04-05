import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          NFL QB Challenge
        </h1>
        
        <div className="max-w-2xl w-full bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">How to Play</h2>
          <div className="space-y-4 text-gray-300">
            <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
            <p>Each quarterback can only be used once throughout the game.</p>
            <p>Type "help" to see available QBs for the current team.</p>
            <p>Your goal is to reach 2,500 total QB career wins.</p>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
        >
          Start Game
        </button>
      </div>
    </Layout>
  );
}; 