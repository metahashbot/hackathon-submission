'use client';

import dynamic from 'next/dynamic';

// 动态导入 Phaser 相关内容
const PhaserGameContent = dynamic(() => 
  import('./phaser-game-content').then(mod => mod.PhaserGameContent),
  { ssr: false } // 禁用服务器端渲染
);

export function PhaserGame() {
  return <PhaserGameContent />;
}