'use client';

import { WalletProvider } from "@/components/providers/wallet-provider";
import { Hero } from "@/components/hero";
import { StakingInterface } from "@/components/StakingInterface";
import { ZodiacSelector, ElementType } from "@/components/ZodiacSelector";
import { RewardsDisplay } from "@/components/RewardsDisplay";
import { useWallet } from "@/components/providers/wallet-provider";
import { useState } from "react";

function HomeContent() {
  const { isConnected } = useWallet();
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Hero />
      {isConnected && (
 <div className="container mx-auto px-4 py-8 space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
   <div>
              <ZodiacSelector onElementSelect={setSelectedElement} />
              {selectedElement && <StakingInterface zodiacElement={selectedElement} />}
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Element Bonuses</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-red-500">🔥</span>
                    <div>
                      <h3 className="font-semibold">Fire Signs</h3>
                      <p className="text-sm text-gray-400">Aries, Leo, Sagittarius</p>
                      <p className="text-sm">Increased staking rewards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-brown-500">⛰️</span>
                    <div>
                      <h3 className="font-semibold">Earth Signs</h3>
                      <p className="text-sm text-gray-400">Taurus, Virgo, Capricorn</p>
                      <p className="text-sm">Enhanced staking stability</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500">💨</span>
                    <div>
                      <h3 className="font-semibold">Air Signs</h3>
                      <p className="text-sm text-gray-400">Gemini, Libra, Aquarius</p>
                      <p className="text-sm">Faster unlock periods</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-300">💧</span>
                    <div>
                      <h3 className="font-semibold">Water Signs</h3>
                      <p className="text-sm text-gray-400">Cancer, Scorpio, Pisces</p>
                      <p className="text-sm">Extra governance weight</p>
                    </div>
                  </div>
                </div>
              </div>
              <RewardsDisplay />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  );
}