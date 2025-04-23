import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameOverProps {
  totalScore: number;
  bestPick: { name: string; wins: number } | null;
  usedHelp: boolean;
  isTopTen: boolean;
  topTenThreshold: number;
  onPlayAgain: () => void;
  onSubmitScore: (playerName: string) => void;
  onSkipLeaderboard: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  totalScore,
  bestPick,
  usedHelp,
  isTopTen,
  topTenThreshold,
  onPlayAgain,
  onSubmitScore,
  onSkipLeaderboard,
}) => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = React.useState('');

  const handleShare = async () => {
    const text = `🏈 StatStack QB Challenge\n${totalScore} Career Wins${usedHelp ? ' (with help)' : ''}\nPlay at statstack-lite.web.app`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: text
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        // TODO: Show toast notification
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center">
      {/* Career Wins Total */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-main dark:text-main-dark mb-1">
          {totalScore.toLocaleString()}
        </div>
        <div className="text-lg text-muted dark:text-muted-dark">
          Career Wins
        </div>
      </div>

      {/* Stats Block */}
      <div className="w-full bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 mb-8">
        {bestPick && (
          <div className="mb-4 text-center">
            <div className="text-sm text-muted dark:text-muted-dark mb-1">Best Pick</div>
            <div className="text-lg font-medium text-main dark:text-main-dark">
              {bestPick.name} (+{bestPick.wins})
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-sm text-muted dark:text-muted-dark mb-1">Game Status</div>
          <div className="text-lg font-medium text-main dark:text-main-dark">
            {usedHelp ? '🆘 Help Enabled' : '🧠 No Help Used'}
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      {isTopTen ? (
        <div className="w-full mb-8">
          <div className="text-center mb-4 text-lg font-medium text-green-600 dark:text-green-400">
            You made the Top 10!
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
            <button
              onClick={() => onSubmitScore(playerName)}
              disabled={!playerName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
          <button
            onClick={onSkipLeaderboard}
            className="w-full mt-2 px-4 py-2 text-sm text-muted dark:text-muted-dark hover:text-main dark:hover:text-main-dark transition-colors"
          >
            Skip
          </button>
        </div>
      ) : (
        <div className="text-center mb-8 text-muted dark:text-muted-dark">
          Top 10 starts at {topTenThreshold.toLocaleString()}. You were close!
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-center text-main dark:text-main-dark"
        >
          Share Score
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-center text-main dark:text-main-dark"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
}; 