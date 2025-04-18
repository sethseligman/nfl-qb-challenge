import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
  usedHelp: boolean;
}

interface Score {
  id: string;
  date: string;
  totalScore: number;
  tier: string;
  picks: QB[];
}

interface GameState {
  currentTeam: string | null;
  picks: QB[];
  isGameOver: boolean;
  showScore: boolean;
  usedQBs: string[];
  totalScore: number;
  scores: Score[];
  toggleScore: () => void;
  addScore: (score: Score) => void;
  clearScores: () => void;
  setIsGameOver: (value: boolean) => void;
}

interface GameActions {
  setCurrentTeam: (team: string) => void;
  addPick: (qb: string, wins: number, displayName: string) => void;
  resetGame: () => void;
  setShowScore: (show: boolean) => void;
  initializeGame: () => void;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      currentTeam: null,
      picks: [],
      isGameOver: false,
      showScore: false,
      usedQBs: [],
      totalScore: 0,
      scores: [],
      toggleScore: () => set((state) => ({ showScore: !state.showScore })),
      setCurrentTeam: (team) => set({ currentTeam: team }),
      addPick: (qb, wins, displayName) =>
        set((state) => {
          const newPicks = [...state.picks, { qb, wins, displayName, team: state.currentTeam || '', usedHelp: false }];
          const newUsedQBs = [...state.usedQBs, qb];
          const isOver = newPicks.length >= 20;
          const newTotalScore = state.totalScore + wins;

          return {
            picks: newPicks,
            usedQBs: newUsedQBs,
            isGameOver: isOver,
            currentTeam: state.currentTeam,
            totalScore: newTotalScore
          };
        }),
      resetGame: () =>
        set((state) => ({
          picks: [],
          isGameOver: false,
          usedQBs: [],
          currentTeam: state.currentTeam,
          totalScore: 0,
          showScore: state.showScore
        })),
      setShowScore: (show) => set({ showScore: show }),
      initializeGame: () => set({
        currentTeam: null,
        picks: [],
        isGameOver: false,
        showScore: false,
        usedQBs: [],
        totalScore: 0
      }),
      addScore: (score) => 
        set((state) => ({
          scores: [...state.scores, score]
        })),
      clearScores: () => 
        set({ scores: [] }),
      setIsGameOver: (value) => set({ isGameOver: value })
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({ 
        showScore: state.showScore,
        scores: state.scores 
      })
    }
  )
); 