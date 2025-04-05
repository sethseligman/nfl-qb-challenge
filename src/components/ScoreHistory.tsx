import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName } from '../data/qbData';

export const ScoreHistory: React.FC = () => {
  const { picks } = useGameStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Score History</h3>
      <div className="space-y-2">
        {picks.map((pick, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatQBDisplayName(pick.qb, pick.qb)}</span>
              {pick.usedHelp && (
                <span className="text-yellow-500" title="Used help">🆘</span>
              )}
            </div>
            <div className="text-right">
              <span className="font-medium">{pick.wins}</span>
              <span className="text-gray-400 ml-1">wins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 