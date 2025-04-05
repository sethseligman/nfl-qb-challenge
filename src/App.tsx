import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Game } from './components/Game';
import { LobbyPage } from './components/LobbyPage';
import { AppLayout } from './components/AppLayout';
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
      <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/nba" element={<div className="text-center p-8">NBA Scorer Challenge - Coming Soon!</div>} />
          <Route path="/mlb" element={<div className="text-center p-8">MLB Pitcher Challenge - Coming Soon!</div>} />
          <Route path="/soccer" element={<div className="text-center p-8">Soccer Goals Challenge - Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App; 