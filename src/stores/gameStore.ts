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
    
    // Get a random team that hasn't been used yet
    const usedTeams = newPicks.map(pick => pick.team);
    const availableTeams = nflTeams.filter(team => !usedTeams.includes(team));
    const nextTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    
    set({
      picks: newPicks,
      currentTeam: nextTeam,
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