import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface EndGameCTAProps {
  onSaveGame: () => void;
}

export function EndGameCTA({ onSaveGame }: EndGameCTAProps) {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Great run! 🎉</h3>
        <p className="text-gray-600 mb-4">
          Want to save this score and start tracking your stats?
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          onClick={onSaveGame}
        >
          Create an account
        </Link>
      </div>
    </div>
  );
} 