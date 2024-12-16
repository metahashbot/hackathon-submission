"use client"

import { useCurrentAccount, useSignAndExecuteTransaction, useDisconnectWallet } from '@mysten/dapp-kit'

export function useWalletKit() {
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction()
  const { mutate: disconnect } = useDisconnectWallet()

  return {
    currentAccount,
    address: currentAccount?.address,
    signAndExecuteTransactionBlock,
    connected: !!currentAccount,
    isConnecting: false,
    disconnect
  }
} 