import React from 'react';
import { Link } from 'react-router-dom';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  title
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
              Statstack
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/nfl" className="text-gray-300 hover:text-white transition-colors">NFL</Link>
              <Link to="/nba" className="text-gray-300 hover:text-white transition-colors">NBA</Link>
              <Link to="/mlb" className="text-gray-300 hover:text-white transition-colors">MLB</Link>
              <Link to="/nhl" className="text-gray-300 hover:text-white transition-colors">NHL</Link>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-white">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {title}
          </h1>
        </div>

        {/* Game Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}; 