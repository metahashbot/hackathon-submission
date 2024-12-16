'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '@/game/config';
import { useGameStore } from '@/game/store/gameStore';

export function PhaserGameContent() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { setGameInstance } = useGameStore();

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const config = {
      ...gameConfig,
      parent: gameContainerRef.current,
      scale: {
        ...gameConfig.scale,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    setGameInstance(game);

    return () => {
      game.destroy(true);
    };
  }, [setGameInstance]);

  return (
    <div 
      ref={gameContainerRef} 
      className="absolute inset-0"
    />
  );
}