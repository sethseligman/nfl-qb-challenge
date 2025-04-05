import React from 'react';

interface GameContainerProps {
  children: React.ReactNode;
  currentRound: number;
  totalScore: number;
  showScore: boolean;
  toggleScore: () => void;
  setShowRules: (show: boolean) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  children,
  currentRound,
  totalScore,
  showScore,
  toggleScore,
  setShowRules
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Game Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Round {currentRound}/10</span>
            <span className="text-gray-300">|</span>
            <span className="text-white font-medium">Score: {totalScore}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRules(true)}
              className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
            >
              Rules
            </button>
            <button
              onClick={toggleScore}
              className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
            >
              {showScore ? 'Hide Score' : 'Show Score'}
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameContainer; 