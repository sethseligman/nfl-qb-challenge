import React from 'react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">How to Play</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 text-gray-300">
          <p>1. You'll be shown a random NFL team</p>
          <p>2. Name a quarterback who played for that team</p>
          <p>3. Each quarterback can only be used once</p>
          <p>4. Points are awarded based on the quarterback's career wins</p>
          <p>5. Try to get the highest score possible in 20 rounds!</p>
          <p>6. Type 'help' for a list of available quarterbacks</p>
          <p>7. Use the 'Show Scores' button to toggle score visibility</p>
          <p>8. Click 'New Game' to start over</p>
        </div>
      </div>
    </div>
  );
}; 