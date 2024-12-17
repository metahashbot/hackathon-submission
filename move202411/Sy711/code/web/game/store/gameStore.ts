import { create } from 'zustand';
import { PageInfo } from '../scenes/PreloadScene';

interface GameState {
  score: number;
  gameInstance: Phaser.Game | null;
  setScore: (score: number) => void;
  setGameInstance: (game: Phaser.Game) => void;
  pageInfo: PageInfo;
  setPageInfo: (pageInfo: PageInfo) => void;
  gameState: 'preload' | 'started' | 'init' | 'paused' | 'unstarted'
  setGameState: (gameState: 'preload' | 'started' | 'init' | 'paused' | 'unstarted') => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  gameInstance: null,
  pageInfo: {
    page: 0,
    total: 3
  },
  setScore: (score) => set({ score }),
  setGameInstance: (game) => set({ gameInstance: game }),
  setPageInfo: (pageInfo) => set({ pageInfo }),
  gameState: 'unstarted',
  setGameState: (gameState) => set({ gameState }),
})); 