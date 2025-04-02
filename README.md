# NFL QB Wins Challenge

A fun web game where players try to reach 2,500 total QB career wins by selecting quarterbacks for randomly chosen NFL teams.

## Features

- 20 rounds of gameplay
- Random NFL team selection each round
- QB validation and win tracking
- Score tier system
- Modern, responsive UI with Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Game Rules

1. Each round, a random NFL team is shown
2. Enter a QB who played for that team
3. Enter the QB's total career wins
4. QBs cannot be reused
5. No skipping teams
6. Try to reach 2,500 total wins across 20 rounds

## Score Tiers

- < 2000: College Walk-On
- 2000-2199: Pop Warner
- 2200-2299: HS All-American
- 2300-2399: Draft Pick
- 2400-2499: Heisman Winner
- 2500+: GOAT

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)

## Future Enhancements

- Leaderboard integration
- Multiplayer mode
- Hint system
- Difficulty modes
- QB database integration 