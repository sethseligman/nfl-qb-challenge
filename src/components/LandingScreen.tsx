import React from 'react';

/** @jsxImportSource react */
interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-500 mb-6">NFL QB Challenge</h1>
        <p className="text-xl text-gray-300 mb-8">
          Test your NFL knowledge by naming quarterbacks for each team. 
          Each QB can only be used once, and you'll get points based on their career wins.
        </p>
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors duration-200 transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default LandingScreen; 