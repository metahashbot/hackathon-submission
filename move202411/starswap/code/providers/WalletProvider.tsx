"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'
import { toast } from 'sonner'

const queryClient = new QueryClient()

const { networkConfig } = createNetworkConfig({
  testnet: { 
    url: getFullnodeUrl('testnet'),
    variables: {
      // 添加网络特定的配置
      PACKAGE_ID: '0x...',
      STAKE_POOL_ID: '0x...'
    }
  },
  mainnet: { 
    url: getFullnodeUrl('mainnet'),
    variables: {
      PACKAGE_ID: '0x68a0485c2327d703347481fe630e0dfec1a72cac9b1e5736a44b547ff97c599b',
      STAKE_POOL_ID: '0x3033d051e7bf483d0530aae8eec526bbb79bf6eb32746ab2aa2cc951828902a5'
    }
  }
})

// 使用 sessionStorage
const storageAdapter = {
  get: (key: string) => {
    try {
      return sessionStorage.getItem(key)
    } catch (e) {
      console.warn('Storage get failed:', e)
      return null
    }
  },
  set: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value)
    } catch (e) {
      console.warn('Storage set failed:', e)
      toast.error('钱包连接状态存储失败')
    }
  },
  remove: (key: string) => {
    try {
      sessionStorage.removeItem(key)
    } catch (e) {
      console.warn('Storage remove failed:', e)
    }
  }
}

export default function WalletContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
          autoConnect={true}
          storageAdapter={storageAdapter}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
} 