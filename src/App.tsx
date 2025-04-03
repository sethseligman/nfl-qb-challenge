import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './firebase/config';
import LoginPage from './components/LoginPage';
import { LobbyPage } from './components/LobbyPage';
import { Game } from './components/Game';
import './index.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/"
            element={user ? <LobbyPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/nfl-qb-challenge"
            element={user ? <Game /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 