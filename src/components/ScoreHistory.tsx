import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName } from '../data/qbData';

export const ScoreHistory: React.FC = () => {
  const { scores, clearScores } = useGameStore();

  if (scores.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Score History</h2>
        <p className="text-gray-400 text-center">No games played yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-500">Score History</h2>
        <button
          onClick={clearScores}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-6">
        {scores.map((score) => (
          <div key={score.id} className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <div className="text-lg font-semibold text-white">
                  Score: {score.totalScore}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(score.date).toLocaleDateString()} at {new Date(score.date).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-emerald-500">{score.tier}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {score.picks.map((pick, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium">{formatQBDisplayName(pick.qb, pick.qb)}</span>
                  {pick.usedHelp && (
                    <span className="text-yellow-500" title="Used help">🆘</span>
                  )}
                  <span className="text-gray-400">({pick.wins} wins)</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 