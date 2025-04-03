import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthBanner } from './components/AuthBanner';
import { Login } from './components/Login';
import { Game } from './components/Game';
import { Lobby } from './components/Lobby';
import { MyGames } from './pages/MyGames';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import './index.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('AppContent: Rendering with state:', {
    pathname: location.pathname,
    loading,
    user: user ? 'authenticated' : 'anonymous'
  });

  // Show loading state while auth is being checked
  if (loading) {
    console.log('AppContent: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log('AppContent: Rendering routes');
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <AuthBanner />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes - accessible to all users */}
          <Route path="/" element={<Lobby />} />
          <Route path="/nfl-qb-challenge" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nba" element={<div className="text-center p-8 text-white">NBA Scorer Challenge - Coming Soon!</div>} />
          <Route path="/mlb" element={<div className="text-center p-8 text-white">MLB Pitcher Challenge - Coming Soon!</div>} />
          <Route path="/soccer" element={<div className="text-center p-8 text-white">Soccer Goals Challenge - Coming Soon!</div>} />

          {/* Protected routes - require authentication */}
          <Route
            path="/my-games"
            element={
              <ProtectedRoute>
                <MyGames />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 