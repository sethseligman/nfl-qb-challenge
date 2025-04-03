import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';

const QBPhoto: React.FC<{ qb: string; size?: 'sm' | 'lg' }> = ({ qb, size = 'sm' }) => {
  const [showImage, setShowImage] = React.useState(true);
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
              <div className="text-lg font-semibold text-white">
                Score: {score.totalScore}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(score.date).toLocaleDateString()}
              </div>
            </div>
            <div className="text-emerald-500 mb-4">Tier: {score.tier}</div>
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
                      <div className="font-semibold text-white">{pick.displayName}</div>
                      <div className="text-sm text-emerald-500">{pick.wins} wins</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 