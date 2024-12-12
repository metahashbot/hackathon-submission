'use client';

import { WalletProvider } from '@suiet/wallet-kit';
import { SuiTestnetChain } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

import type { Chain } from '@suiet/wallet-kit';

interface ProvidersProps {
  children: React.ReactNode;
}

// 设置支持的链
const SupportedChains: Chain[] = [SuiTestnetChain];

// 配置 QueryClient（react-query）
const queryClient = new QueryClient();

// 配置 SuiClientProvider
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

export function Providers({ children }: ProvidersProps) {
  //用什么网，默认里面就填什么
  return (
    <QueryClientProvider client={queryClient}>
      
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider chains={SupportedChains}>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}