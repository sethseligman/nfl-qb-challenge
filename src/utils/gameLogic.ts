import { useGameStore } from '../store/gameStore';
import { qbDatabase } from '../data/qbData';

export const initializeGame = () => {
  const store = useGameStore.getState();
  store.initializeGame();
};

export const startGame = () => {
  const store = useGameStore.getState();
  const teams = Object.keys(qbDatabase);
  
  // Shuffle teams array
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  
  // Select first team from shuffled array
  const randomTeam = shuffledTeams[0];
  store.setCurrentTeam(randomTeam);
}; 