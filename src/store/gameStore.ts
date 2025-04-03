import { create } from 'zustand'

interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
}

interface GameState {
  currentTeam: string | null;
  picks: QB[];
  isGameOver: boolean;
  showScore: boolean;
  usedQBs: string[];
}

interface GameActions {
  setCurrentTeam: (team: string | null) => void;
  addPick: (qb: string, wins: number, displayName: string) => void;
  resetGame: () => void;
  setShowScore: (show: boolean) => void;
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  currentTeam: null,
  picks: [],
  isGameOver: false,
  showScore: false,
  usedQBs: [],
  setCurrentTeam: (team) => set({ currentTeam: team }),
  addPick: (qb, wins, displayName) =>
    set((state) => {
      const newPicks = [...state.picks, { qb, wins, displayName, team: state.currentTeam || '' }];
      const newUsedQBs = [...state.usedQBs, qb];
      const isOver = newPicks.length >= 20;

      return {
        picks: newPicks,
        usedQBs: newUsedQBs,
        isGameOver: isOver,
        currentTeam: state.currentTeam
      };
    }),
  resetGame: () =>
    set({
      picks: [],
      isGameOver: false,
      showScore: false,
      usedQBs: [],
    }),
  setShowScore: (show) => set({ showScore: show }),
})); 