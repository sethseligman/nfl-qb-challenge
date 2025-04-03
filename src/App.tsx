import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthBanner } from './components/AuthBanner';
import { Login } from './components/Login';
import { Game } from './components/Game';
import { MyGames } from './pages/MyGames';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <AuthBanner />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<Game />} />
            <Route
              path="/my-games"
              element={
                <ProtectedRoute>
                  <MyGames />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/game" replace />} />
            <Route path="/nba" element={<div className="text-center p-8">NBA Scorer Challenge - Coming Soon!</div>} />
            <Route path="/mlb" element={<div className="text-center p-8">MLB Pitcher Challenge - Coming Soon!</div>} />
            <Route path="/soccer" element={<div className="text-center p-8">Soccer Goals Challenge - Coming Soon!</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 