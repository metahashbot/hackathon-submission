"use client"

import { useCurrentAccount } from '@mysten/dapp-kit'
import StakingInfo from './StakingInfo'

export function RewardsDisplay() {
  const currentAccount = useCurrentAccount()

  if (!currentAccount) return null

  return (
    <div className="absolute top-4 left-4">
      <StakingInfo />
    </div>
  )
}