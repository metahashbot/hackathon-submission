'use client'

import { WalletKitProvider } from '@mysten/wallet-kit'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletKitProvider>
      {children}
    </WalletKitProvider>
  )
} 