import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { LobbyPage } from './components/LobbyPage';
import { Game } from './components/Game';
import './index.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('NFL');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to the appropriate route based on the tab
    if (tab === 'NFL') {
      window.location.href = '/';
    } else if (tab === 'NBA') {
      window.location.href = '/nba';
    } else if (tab === 'MLB') {
      window.location.href = '/mlb';
    } else if (tab === 'Soccer') {
      window.location.href = '/soccer';
    }
  };

  return (
    <Router>
      <Routes>
        <Route element={<AppLayout onTabChange={handleTabChange} />}>
          <Route path="/" element={<LobbyPage />} />
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