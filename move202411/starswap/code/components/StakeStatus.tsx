interface StakeStatusProps {
  nft: {
    element: string
    stakeAmount: string
    lockPeriod: number
    lastClaimTime: number
  }
  rewards: string
}

export function StakeStatus({ nft, rewards }: StakeStatusProps) {
  const getElementMultiplier = (element: string) => {
    const multipliers = {
      'fire': 100,
      'water': 80, 
      'earth': 60,
      'air': 40
    }
    return multipliers[element] || 0
  }

  return (
    <div className="mt-6 p-4 bg-white/5 rounded-lg">
      <h3 className="text-lg font-medium mb-4">质押状态</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>质押数量:</span>
          <span>{nft.stakeAmount} SUI</span>
        </div>

        <div className="flex justify-between">
          <span>收益倍数:</span>
          <span>{getElementMultiplier(nft.element)}%</span>
        </div>

        <div className="flex justify-between">
          <span>当前收益:</span>
          <span>{rewards} SUI</span>
        </div>

        <div className="flex justify-between">
          <span>解锁时间:</span>
          <span>
            {new Date(nft.lastClaimTime + nft.lockPeriod).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
} 