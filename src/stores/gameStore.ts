import { create } from 'zustand';
import { nflTeams } from '../data/nflTeams';

interface Pick {
  team: string;
  qb: string;
  wins: number;
}

interface GameState {
  picks: Pick[];
  currentTeam: string;
  totalScore: number;
  addPick: (team: string, qb: string, wins: number) => void;
  resetGame: () => void;
  saveGame: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  picks: [],
  currentTeam: '',
  totalScore: 0,

  addPick: (team, qb, wins) => {
    const newPicks = [...get().picks, { team, qb, wins }];
    const newTotalScore = newPicks.reduce((sum, pick) => sum + pick.wins, 0);
    
    set({
      picks: newPicks,
      totalScore: newTotalScore
    });
  },

  resetGame: () => {
    const randomTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
    set({
      picks: [],
      currentTeam: randomTeam,
      totalScore: 0
    });
  },

  saveGame: async () => {
    // This will be implemented when we add Firebase integration
    console.log('Saving game:', get().picks);
  }
})); 