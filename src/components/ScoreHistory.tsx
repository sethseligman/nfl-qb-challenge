import React, { useState, useEffect } from 'react';
import { getTeamLogo } from '../utils/teamLogos';
import { getQBPhoto } from '../utils/qbPhotos';

interface Score {
  id: string;
  date: Date;
  totalScore: number;
  tier: string;
  picks: Array<{
    team: string;
    qb: string;
    wins: number;
  }>;
}

interface ScoreHistoryProps {
  scores: Score[];
}

function QBPhoto({ qb }: { qb: string }) {
  const photo = getQBPhoto(qb);
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
      {photo ? (
        <img src={photo} alt={qb} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-medium text-gray-600">
          {qb.split(' ').map(n => n[0]).join('')}
        </span>
      )}
    </div>
  );
}

export function ScoreHistory({ scores }: ScoreHistoryProps) {
  const [expandedScores, setExpandedScores] = useState<Set<string>>(new Set());

  const toggleScore = (scoreId: string) => {
    setExpandedScores(prev => {
      const next = new Set(prev);
      if (next.has(scoreId)) {
        next.delete(scoreId);
      } else {
        next.add(scoreId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {scores.length === 0 ? (
        <p className="text-gray-600">No games played yet.</p>
      ) : (
        scores.map(score => (
          <div
            key={score.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Score: {score.totalScore}</h3>
                <p className="text-sm text-gray-600">
                  {score.date.toLocaleDateString()} at {score.date.toLocaleTimeString()}
                </p>
                <p className="text-sm font-medium text-blue-600">Tier: {score.tier}</p>
              </div>
              <button
                onClick={() => toggleScore(score.id)}
                className="text-blue-500 hover:text-blue-600"
              >
                {expandedScores.has(score.id) ? 'Hide Picks' : 'Show Picks'}
              </button>
            </div>
            {expandedScores.has(score.id) && (
              <div className="mt-4 space-y-2">
                {score.picks.map((pick, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={getTeamLogo(pick.team)}
                      alt={pick.team}
                      className="w-6 h-6"
                    />
                    <QBPhoto qb={pick.qb} />
                    <span className="text-sm">
                      {pick.team} - {pick.qb} ({pick.wins} wins)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 