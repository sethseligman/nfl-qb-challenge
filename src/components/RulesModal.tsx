import React from 'react';

interface RulesModalProps {
  onClose: () => void;
  isInitialStart?: boolean;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose, isInitialStart = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4">
        {isInitialStart ? (
          <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">How to Play</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        )}
        <div className="space-y-4 text-gray-300">
          <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
          <p>Each quarterback can only be used once throughout the game.</p>
          <p>Type "help" to see available QBs for the current team.</p>
          <p>Each game consists of 2 rounds.</p>
          <p>Your goal is to reach 2,500 total QB career wins.</p>
          {isInitialStart && (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Let's Play
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 