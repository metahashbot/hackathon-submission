'use client';
import { PhaserGame } from '@/components/game/phaser-game';
import { GameUI } from '@/components/game/game-ui';

export default function GamePage() {
  return (
    <main className="h-screen w-full bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-lg flex items-center justify-center">
        <div className="w-full aspect-[9/16] bg-black relative">
          <PhaserGame />
          <GameUI />
        </div>
      </div>
    </main>
  );
}