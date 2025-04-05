import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LobbyPage: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">NFL QB Challenge</h1>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-md">
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
              <div className="space-y-4 text-gray-300">
                <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
                <p>Each quarterback can only be used once throughout the game.</p>
                <p>Type "help" to see available QBs for the current team.</p>
                <p>Your goal is to reach 2,500 total QB career wins.</p>
              </div>
            </div>
          </div>

          <Link
            to="/nfl-qb-challenge"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Start Game
          </Link>
        </div>
      </div>

      {showRules && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowRules(false)}
        >
          <div 
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Game Rules</h2>
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
    </div>
  );
};

export default LobbyPage; 