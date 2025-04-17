import { create } from 'zustand'

export interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
  usedHelp: boolean;
}

interface GameState {
  currentTeam: string | null;
  picks: QB[];
  usedQBs: string[];
  isGameOver: boolean;
  showScore: boolean;
  totalScore: number;
  currentPickUsedHelp: boolean;
  scores: {
    id: string;
    date: string;
    totalScore: number;
    picks: QB[];
  }[];
  initializeGame: () => void;
  setCurrentTeam: (team: string) => void;
  addPick: (qb: string, wins: number, displayName: string) => void;
  toggleScore: () => void;
  setIsGameOver: (isOver: boolean) => void;
  clearScores: () => void;
  setCurrentPickUsedHelp: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentTeam: null,
  picks: [],
  usedQBs: [],
  isGameOver: false,
  showScore: false,
  totalScore: 0,
  currentPickUsedHelp: false,
  scores: [],

  initializeGame: () => set({
    currentTeam: null,
    picks: [],
    usedQBs: [],
    isGameOver: false,
    totalScore: 0,
    currentPickUsedHelp: false
  }),

  setCurrentTeam: (team) => set({ currentTeam: team }),

  addPick: (qb, wins, displayName) => set((state) => {
    const currentTeam = state.currentTeam;
    if (currentTeam === null) return state;

    const newPicks = [...state.picks, { 
      qb, 
      team: currentTeam, 
      displayName, 
      wins,
      usedHelp: state.currentPickUsedHelp 
    }];

    return {
      picks: newPicks,
      usedQBs: [...state.usedQBs, qb],
      totalScore: state.totalScore + wins,
      isGameOver: newPicks.length >= 20,
      currentPickUsedHelp: false // Reset help flag for next pick
    };
  }),

  toggleScore: () => set((state) => ({ showScore: !state.showScore })),

  setIsGameOver: (isOver) => set({ isGameOver: isOver }),

  clearScores: () => set({ scores: [] }),

  setCurrentPickUsedHelp: () => set({ currentPickUsedHelp: true })
})); 