import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LobbyPage } from './components/LobbyPage';
import { Game } from './components/Game';
import Layout from './components/Layout';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Layout><LobbyPage /></Layout>} />
          <Route path="/nfl-qb-challenge" element={<Layout><LobbyPage /></Layout>} />
          <Route path="/nfl-qb-challenge/game" element={<Layout><Game /></Layout>} />
          <Route path="/nba" element={<Layout><div className="text-center p-8">NBA Scorer Challenge - Coming Soon!</div></Layout>} />
          <Route path="/mlb" element={<Layout><div className="text-center p-8">MLB Pitcher Challenge - Coming Soon!</div></Layout>} />
          <Route path="/soccer" element={<Layout><div className="text-center p-8">Soccer Goals Challenge - Coming Soon!</div></Layout>} />
          <Route path="*" element={<Layout><LobbyPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 