"use client"

import { useCurrentWallet } from '@mysten/dapp-kit'
import Image from 'next/image'

export function WalletInfo() {
  const { currentWallet, connectionStatus } = useCurrentWallet()

  if (connectionStatus !== 'connected') {
    return (
      <div className="text-sm text-gray-500">
        连接状态: {connectionStatus === 'connecting' ? '连接中...' : '未连接'}
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm space-y-3">
      <div className="flex items-center gap-3">
        {currentWallet.icon && (
          <Image 
            src={currentWallet.icon} 
            alt={currentWallet.name} 
            width={24} 
            height={24}
          />
        )}
        <h3 className="font-medium">{currentWallet.name}</h3>
        <span className="text-sm text-gray-400">v{currentWallet.version}</span>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-400">当前账户:</div>
        <ul className="space-y-1">
          {currentWallet.accounts.map((account) => (
            <li 
              key={account.address}
              className="text-sm font-mono bg-white/5 p-2 rounded break-all"
            >
              {account.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 