'use client';

import { PreloadScene } from '@/game/scenes';
import { useGameStore } from '@/game/store/gameStore';

export function GameUI() {
  const { gameInstance, pageInfo } = useGameStore();


  const handlePreloadSceneButtonClick = (isNext: boolean) => {
    if (gameInstance) {
      const preloadScene = gameInstance.scene.getScene('PreloadScene') as PreloadScene;
      preloadScene.updateFromReact({ 
        data: isNext ? 'next' : 'prev'
       });
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end">
      <div className="flex flex-col justify-end">
        <div className="flex flex-row justify-between p-5">
          <button onClick={() => handlePreloadSceneButtonClick(false)} className="min-w-32 bg-opacity-50 bg-blue-500 text-white px-4 py-2 rounded-3xl uppercase">
            prev
          </button>
          {pageInfo.page < pageInfo.total ? <button onClick={() => handlePreloadSceneButtonClick(true)} className="min-w-32 bg-opacity-50 bg-blue-500 text-white px-4 py-2 rounded-3xl uppercase">
            next
          </button> : <button className="min-w-32 bg-blue-500 text-white px-4 py-2 rounded-3xl uppercase">
            Start
          </button>}
          
        </div>

      </div>

      
    </div>
  );
}