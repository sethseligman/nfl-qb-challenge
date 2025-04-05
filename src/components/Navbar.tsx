import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500">
          StatStack
        </Link>
        <div className="flex space-x-4">
          <Link to="/nfl" className="text-gray-300 hover:text-white">NFL</Link>
          <Link to="/nba" className="text-gray-300 hover:text-white">NBA</Link>
          <Link to="/mlb" className="text-gray-300 hover:text-white">MLB</Link>
          <Link to="/soccer" className="text-gray-300 hover:text-white">Soccer</Link>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 