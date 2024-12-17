'use client';
import { PhaserGame } from '@/components/game/phaser-game';
import { GameUI } from '@/components/game/game-ui';
import { useCurrentAccount, ConnectModal } from '@mysten/dapp-kit';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { useGameStore } from '@/game/store/gameStore';
import { getUsersRank, RankData } from '@/contracts';
export default function GamePage() {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { gameState } = useGameStore();
  const [rankData, setRankData] = useState<RankData[]>([]);

  const refreshRank = useCallback(() => {
    if (currentAccount?.address) {
      getUsersRank().then((data) => {
        setRankData(data);
      });
    }
  }, [currentAccount?.address])

  useEffect(() => {
    if(gameState === 'unstarted') {
      refreshRank();
    }
  }, [refreshRank, gameState])

  return (
    <main className="h-screen w-full bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-lg flex items-center justify-center">
        <div className="w-full aspect-[9/16] relative">
          {gameState === 'init' || gameState === 'paused' || gameState === 'preload' || gameState === 'started' ? (
            <>
              <PhaserGame />
              <GameUI />
            </>
          ) : gameState === 'unstarted' && currentAccount?.address && isValidSuiAddress(currentAccount?.address) ? (
            <div className="w-full h-full bg-[url('/images/mainbg.png')] bg-cover bg-center flex flex-col items-center justify-center gap-y-16">
              <div className="min-w-md h-96 backdrop-blur-sm rounded-lg p-8 shadow-lg bg-[url('/images/cardbg.png')] bg-contain bg-no-repeat bg-center flex flex-col items-center justify-start">
                <div className="flex justify-center items-center w-full">
                  <p className="text-white self-center text-center text-3xl font-bold truncate pb-4">
                    Top 5
                  </p>
                  <button
                    className="fixed top-7 right-12 text-white text-sm font-semibold px-4 py-2 rounded-full 
                              bg-gradient-to-r from-red-500 to-red-600
                              hover:from-red-600 hover:to-red-700
                              active:from-red-700 active:to-red-800
                              shadow-lg hover:shadow-xl
                              transform hover:-translate-y-0.5 active:translate-y-0
                              transition-all duration-150
                              uppercase tracking-wider
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    M
                  </button>
                </div>
                {rankData.map((item, index) => (
                  <div key={index} className="max-w-xs flex items-center justify-between px-4 py-2">
                    <p className="w-1/2 text-white text-center text-xl font-bold truncate">{item.id}</p>
                    <p className="text-white text-center text-xl font-bold truncate">{item.value}</p>
                  </div>
                ))}
              </div>
              <Image
                src="/images/start.png"
                alt="start"
                width={300}
                height={300}
                onClick={() => useGameStore.getState().setGameState('init')}
                className="cursor-pointer hover:scale-110 transition-all duration-300 focus:outline-none"
              />
            </div>
          ) : (
            <ConnectModal
              open={open}
              onOpenChange={setOpen}
              trigger={
                <div className="w-full h-full bg-[url('/images/bg.png')] bg-cover bg-center flex flex-col items-center justify-center gap-y-32">
                  <Image
                    src="/images/title.png"
                    alt="title"
                    width={300}
                    height={300}
                  />
                  <Image
                    src="/images/connect.png"
                    alt="connect"
                    width={300}
                    height={300}
                    className="cursor-pointer hover:scale-110 transition-all duration-300 focus:outline-none"
                  />
                </div>
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}