import React from 'react';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">NFL QB Wins Challenge</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">How to Play</h2>
            <p className="text-gray-700">
              You'll be given an NFL team. Enter the name of a quarterback who played for that team. Each QB has a win count, and your goal is to get the highest total score possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You have 20 rounds to select QBs</li>
              <li>Each QB can only be used once</li>
              <li>QBs must have played for the given team</li>
              <li>At any time you can enter 'Help' and the highest available QB will be entered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Scoring Tiers</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Under 2000 wins: College Walk-On</li>
              <li>2000-2199 wins: Pop Warner</li>
              <li>2200-2299 wins: HS All-American</li>
              <li>2300-2399 wins: Draft Pick</li>
              <li>2400-2499 wins: Heisman Winner</li>
              <li>2500+ wins: GOAT</li>
            </ul>
          </section>

          <button
            onClick={onStart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
} 