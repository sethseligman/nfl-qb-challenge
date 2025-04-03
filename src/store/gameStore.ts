import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
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
      showScore: true,
      usedQBs: [],
      totalScore: 0,
      scores: [],
      toggleScore: () => set((state) => ({ showScore: !state.showScore })),
      setCurrentTeam: (team) => set({ currentTeam: team }),
      addPick: (qb, wins, displayName) =>
        set((state) => {
          const newPicks = [...state.picks, { qb, wins, displayName, team: state.currentTeam || '' }];
          const newUsedQBs = [...state.usedQBs, qb];
          const isOver = newPicks.length >= 20;
          const newTotalScore = newPicks.reduce((sum, pick) => sum + pick.wins, 0);

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
      initializeGame: () => set((state) => ({
        currentTeam: null,
        picks: [],
        isGameOver: false,
        showScore: state.showScore,
        usedQBs: [],
        totalScore: 0,
        scores: state.scores
      })),
      addScore: (score) => 
        set((state) => ({
          scores: [...state.scores, score]
        })),
      clearScores: () => 
        set({ scores: [] })
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