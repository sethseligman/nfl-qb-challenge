import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/Game';
import { LobbyPage } from './components/LobbyPage';
import Layout from './components/Layout';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/nba" element={<div className="text-center p-8">NBA Scorer Challenge - Coming Soon!</div>} />
          <Route path="/mlb" element={<div className="text-center p-8">MLB Pitcher Challenge - Coming Soon!</div>} />
          <Route path="/soccer" element={<div className="text-center p-8">Soccer Goals Challenge - Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 