interface ElementNFTProps {
  element: string
  stakeAmount: string 
  lockPeriod: number
  lastClaimTime: number
  multiplier: number
  unlockReduction: number
  governanceWeight: number
}

export function ElementNFTCard({
  element,
  stakeAmount,
  lockPeriod,
  lastClaimTime,
  multiplier,
  unlockReduction, 
  governanceWeight
}: ElementNFTProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Element NFT</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>元素类型:</span>
          <span className="font-medium">{element}</span>
        </div>

        <div className="flex justify-between">
          <span>质押数量:</span>
          <span>{stakeAmount} SUI</span>
        </div>

        <div className="flex justify-between">
          <span>锁定期:</span>
          <span>{lockPeriod} 天</span>
        </div>

        <div className="flex justify-between">
          <span>收益倍数:</span>
          <span>{multiplier}%</span>
        </div>

        <div className="flex justify-between">
          <span>解锁减免:</span>
          <span>{unlockReduction}%</span>
        </div>

        <div className="flex justify-between">
          <span>治理权重:</span>
          <span>{governanceWeight}</span>
        </div>

        <div className="flex justify-between">
          <span>上次领取:</span>
          <span>{new Date(lastClaimTime).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
} 