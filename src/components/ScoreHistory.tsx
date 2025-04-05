import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import { formatQBDisplayName } from '../data/qbData';

interface Score {
  id: string;
  date: string;
  totalScore: number;
  tier: string;
  picks: {
    qb: string;
    wins: number;
    displayName: string;
    team: string;
  }[];
}

const QBPhoto: React.FC<{ qb: string; size?: 'sm' | 'lg' }> = ({ qb, size = 'sm' }) => {
  const [showImage, setShowImage] = useState(true);
  const photoUrl = getQBPhoto(qb);

  if (!showImage || !photoUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-700 rounded-full ${
        size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
      }`}>
        <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-lg'}`}>
          {qb.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={qb}
      className={`object-contain rounded-full ${
        size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
      }`}
      onError={() => setShowImage(false)}
    />
  );
};

const ScoreEntry: React.FC<{ score: Score }> = ({ score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(score.date);

  // Reset expanded state when score changes
  useEffect(() => {
    setIsExpanded(false);
  }, [score.id]);

  return (
    <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center mb-4 hover:bg-gray-600/50 rounded-lg p-2 transition-colors"
      >
        <div className="flex flex-col items-start">
          <div className="text-lg font-semibold text-white">
            Score: {score.totalScore}
          </div>
          <div className="text-sm text-gray-400">
            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-emerald-500">{score.tier}</div>
          <div className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {score.picks.map((pick, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getTeamLogo(pick.team)}
                    alt={pick.team}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <QBPhoto qb={pick.qb} size="lg" />
                  <div className="text-center">
                    <div className="font-semibold text-white">{formatQBDisplayName(pick.qb, pick.qb)}</div>
                    <div className="text-sm text-emerald-500">{pick.wins} wins</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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