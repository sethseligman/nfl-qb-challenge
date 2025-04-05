import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400">
          StatStack
        </Link>
        <div className="flex space-x-4">
          <Link to="/login" className="text-white hover:text-blue-400">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 