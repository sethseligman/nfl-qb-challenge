import { create } from 'zustand'

interface QB {
  name: string;
  wins: number;
  teams: string[];
}

interface GameState {
  currentRound: number;
  currentTeam: string | null;
  usedQBs: string[];
  picks: Array<{
    team: string;
    qb: string;
    wins: number;
    displayName: string; // Original input name
  }>;
  totalScore: number;
  isGameOver: boolean;
  showScore: boolean;
  usedTeams: string[];
}

interface GameActions {
  setCurrentTeam: (team: string) => void;
  addPick: (qb: string, wins: number, displayName: string) => void;
  resetGame: () => void;
  toggleScore: () => void;
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

export const useGameStore = create<GameState & GameActions>((set) => ({
  currentRound: 1,
  currentTeam: null,
  usedQBs: [],
  picks: [],
  totalScore: 0,
  isGameOver: false,
  showScore: false,
  usedTeams: [],

  setCurrentTeam: (team) => set({ currentTeam: team }),

  addPick: (qb, wins, displayName) => set((state) => {
    if (!state.currentTeam) return state;
    
    const newRound = state.currentRound + 1;
    const isGameOver = newRound > 20;
    
    return {
      picks: [...state.picks, { team: state.currentTeam, qb, wins, displayName }],
      totalScore: state.totalScore + wins,
      usedQBs: [...state.usedQBs, qb],
      currentRound: newRound,
      currentTeam: null,
      isGameOver,
      usedTeams: [...state.usedTeams, state.currentTeam]
    };
  }),

  resetGame: () => set({
    currentRound: 1,
    currentTeam: null,
    usedQBs: [],
    picks: [],
    totalScore: 0,
    isGameOver: false,
    showScore: false,
    usedTeams: []
  }),

  toggleScore: () => set((state) => ({ showScore: !state.showScore }))
})); 