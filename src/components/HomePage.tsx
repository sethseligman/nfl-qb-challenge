import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome to StatStack</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/nfl-qb-challenge"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white mb-2">NFL QB Challenge</h2>
            <p className="text-gray-400">Test your knowledge of NFL quarterbacks and their career wins.</p>
          </Link>
          {/* Add more game cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 