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
  showHelp: boolean;
}

interface GameActions {
  setCurrentTeam: (team: string) => void;
  addPick: (qb: string, wins: number, displayName: string) => void;
  resetGame: () => void;
  setShowScore: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  currentTeam: null,
  picks: [],
  isGameOver: false,
  showScore: false,
  usedQBs: [],
  showHelp: true,
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
        currentTeam: null,
      };
    }),
  resetGame: () =>
    set({
      currentTeam: null,
      picks: [],
      isGameOver: false,
      showScore: false,
      usedQBs: [],
      showHelp: true,
    }),
  setShowScore: (show) => set({ showScore: show }),
  setShowHelp: (show) => set({ showHelp: show }),
})); 