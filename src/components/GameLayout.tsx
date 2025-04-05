import React from 'react';
import { Link } from 'react-router-dom';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  showScore?: boolean;
  onToggleScore?: () => void;
  onNewGame?: () => void;
  currentRound?: number;
  totalScore?: number;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  title,
  showScore,
  onToggleScore,
  onNewGame,
  currentRound,
  totalScore
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
            NFL Games
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {showScore !== undefined && onToggleScore && (
              <button
                onClick={onToggleScore}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors font-medium text-sm sm:text-base ${
                  showScore 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {showScore ? 'Hide Score' : 'Show Score'}
              </button>
            )}
            {onNewGame && (
              <button
                onClick={onNewGame}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-white text-sm sm:text-base"
              >
                New Game
              </button>
            )}
          </div>
        </div>

        {/* Game Title */}
        <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>

        {/* Game Progress */}
        {(currentRound !== undefined || totalScore !== undefined) && (
          <div className="flex justify-center items-center gap-4 mb-8">
            {currentRound !== undefined && (
              <div className="text-gray-400">Round {currentRound} of 20</div>
            )}
            {showScore && totalScore !== undefined && (
              <div className="text-emerald-500 font-medium">Score: {totalScore}</div>
            )}
          </div>
        )}

        {/* Game Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}; 