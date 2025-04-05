import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-4xl font-bold text-white mb-8">NFL QB Challenge</h1>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <p className="text-gray-300 mb-4">
            Test your NFL knowledge! Name quarterbacks who played for each team to earn points.
            Each QB can only be used once. Type "help" to see available QBs for the current team.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleStartGame}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Game
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Rules
            </button>
          </div>
        </div>

        {/* Rules Modal */}
        {showRules && (
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
              <h2 className="text-2xl font-bold mb-4 text-center text-white">How to Play</h2>
              <div className="space-y-4 text-gray-300">
                <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
                <p>Each quarterback can only be used once throughout the game.</p>
                <p>Type "help" to see available QBs for the current team.</p>
                <p>Your goal is to reach 2,500 total QB career wins.</p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowRules(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}; 