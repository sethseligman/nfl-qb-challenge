import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, qbDatabase, validateQB, normalizeTeamName } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import { ScoreHistory } from './ScoreHistory';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Score {
  id: string;
  date: string;
  totalScore: number;
  tier: string;
  picks: {
    qb: string;
    wins: number;
    displayName: string;
    team: string;
  }[];
}

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

const getTier = (score: number): string => {
  if (score >= 2500) return '🏆 THE GOAT';
  if (score >= 2451) return '🏈 Hall of Famer';
  if (score >= 2401) return '🏆 SuperBowl MVP';
  if (score >= 2351) return '🏈 SuperBowl Winner';
  if (score >= 2301) return '🏆 NFL MVP';
  if (score >= 2251) return '🏆 Heisman Trophy Winner';
  if (score >= 2176) return '🥇 First Round Pick';
  if (score >= 2101) return '🥈 Draft Pick';
  if (score >= 2001) return '🥉 High School All-American';
  if (score >= 1901) return '⭐ Division 1 Scholarship';
  if (score >= 1851) return '⭐ College Walk-on';
  if (score >= 1801) return '⭐ High School Team Captain';
  if (score >= 1751) return '⭐ JV';
  return '⭐ Pop Warner';
};

export function Game() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentTeam,
    picks,
    isGameOver,
    totalScore,
    usedQBs,
    setCurrentTeam,
    addPick,
    resetGame,
    initializeGame
  } = useGameStore();

  const handleNewGame = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'games'), {
        userId: user.uid,
        date: new Date(),
        totalScore,
        tier: getTier(totalScore),
        picks: picks.map(pick => ({
          team: pick.team,
          qb: pick.qb,
          wins: pick.wins
        }))
      });

      resetGame();
      initializeGame();
      navigate('/my-games');
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handlePick = (direction: 'higher' | 'lower') => {
    // TODO: Implement pick logic
  };

  if (isGameOver) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Final Score: {totalScore}</p>
        <p className="text-lg mb-8">Tier: {getTier(totalScore)}</p>
        <button
          onClick={handleNewGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save Score & Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Round {picks.length + 1} of 20</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((picks.length + 1) / 20) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Current Team: {currentTeam}</h3>
        <div className="space-y-4">
          {picks.map((pick, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium">{pick.team}:</span>
              <span>{pick.qb} ({pick.wins} wins)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handlePick('higher')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Higher
        </button>
        <button
          onClick={() => handlePick('lower')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Lower
        </button>
      </div>
    </div>
  );
}