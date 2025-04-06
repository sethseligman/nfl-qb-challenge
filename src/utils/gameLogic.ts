import { useGameStore } from '../store/gameStore';
import { qbDatabase } from '../data/qbData';

export const initializeGame = () => {
  const store = useGameStore.getState();
  store.initializeGame();
};

export const startGame = () => {
  const store = useGameStore.getState();
  const teams = Object.keys(qbDatabase);
  const randomTeam = teams[Math.floor(Math.random() * teams.length)];
  store.setCurrentTeam(randomTeam);
}; 