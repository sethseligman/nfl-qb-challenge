import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { LobbyPage } from './components/LobbyPage';
import { Game } from './components/Game';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/nfl" element={<LobbyPage />} />
          <Route path="/nba" element={<LobbyPage />} />
          <Route path="/mlb" element={<LobbyPage />} />
          <Route path="/soccer" element={<LobbyPage />} />
          <Route path="/more" element={<div className="text-white">More games coming soon!</div>} />
          <Route path="/nfl/qb-challenge" element={<Game />} />
          <Route path="/nba/scorer-challenge" element={<div className="text-white">NBA Scorer Challenge - Coming Soon!</div>} />
          <Route path="/mlb/hitter-challenge" element={<div className="text-white">MLB Hitter Challenge - Coming Soon!</div>} />
          <Route path="/soccer/scorer-challenge" element={<div className="text-white">Soccer Scorer Challenge - Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 