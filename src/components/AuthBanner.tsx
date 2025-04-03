import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthBanner() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700">
              💡 Want to track your wins and climb the leaderboard?{' '}
              <Link to="/login" className="font-semibold underline hover:text-blue-800">
                Sign up for free
              </Link>{' '}
              to unlock full game history & rankings.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 