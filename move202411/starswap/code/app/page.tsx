"use client"

import { Hero } from '@/components/hero';
import StakingForm from '@/components/StakingForm';
import { RewardsDisplay } from '@/components/RewardsDisplay';
import { useCurrentAccount } from '@mysten/dapp-kit';
import WalletConnect from '@/components/WalletConnect';
import StakingInfo from '@/components/StakingInfo';
import Image from 'next/image';
import { GovernanceInfo } from '@/components/GovernanceInfo';
import { TestMintForm } from '../components/TestMintForm';

export default function Home() {
  const currentAccount = useCurrentAccount();
  
  return (
    <main className="relative min-h-screen bg-[#0B0B2C] bg-[url('/stars-bg.png')] bg-cover">
      {/* 星空动画层 */}
      <TestMintForm />
      <div className="stars"></div>
      <div className="constellation-lines"></div>
      
      {/* 内容层 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-6xl font-bold gradient-text mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              StarSwap
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              基于星座元素的 Sui 去中心化质押系统，将传统占星术与区块链技术完美结合
            </p>
            <div className="flex gap-4 mt-8">
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-white font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/20">
                开始质押
              </button>
              <button className="px-8 py-3 bg-purple-700/30 backdrop-blur-sm border border-purple-500/30 rounded-full text-white font-semibold hover:bg-purple-700/40 transition-all shadow-lg hover:shadow-purple-500/20">
                了解更多
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Staking Form */}
            <div className="bg-gradient-to-br from-[#2A2171]/80 to-[#1C1650]/90 backdrop-blur-md rounded-2xl p-6 border border-[#6366F1]/20 shadow-[0_8px_32px_rgba(99,102,241,0.1)] hover:shadow-[#6366F1]/10 transition-all">
              {currentAccount ? (
                <StakingForm />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl text-white/90 mb-6">连接钱包开始质押</h3>
                  <WalletConnect />
                </div>
              )}
            </div>

            {/* Right Column - Stats & Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#2A2171]/80 to-[#1C1650]/90 backdrop-blur-md rounded-2xl p-6 border border-[#6366F1]/20 shadow-[0_8px_32px_rgba(99,102,241,0.1)] hover:shadow-[#6366F1]/10 transition-all">
                <h3 className="text-xl text-white/90 mb-4">质押统计</h3>
                <StakingInfo />
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(31,41,55,0.1)] hover:shadow-white/5 transition-all">
                <h3 className="text-xl text-white/90 mb-4 drop-shadow-md"></h3>
                {/* <RewardsDisplay /> */}
              
   </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}