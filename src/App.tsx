import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import HomePage from './components/HomePage';
import Game from './components/Game';
import LoginPage from './components/LoginPage';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nfl-qb-challenge" element={<Game />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/nba" element={<div className="text-center p-8">NBA Scorer Challenge - Coming Soon!</div>} />
            <Route path="/mlb" element={<div className="text-center p-8">MLB Pitcher Challenge - Coming Soon!</div>} />
            <Route path="/soccer" element={<div className="text-center p-8">Soccer Goals Challenge - Coming Soon!</div>} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App; 