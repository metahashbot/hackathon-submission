interface Props {
  nftCount: number
  stakedAmount: string
  zodiacElement: string
}

export function GovernanceInfo({ nftCount, stakedAmount, zodiacElement }: Props) {
  const calculateWeight = () => {
    let baseWeight = Number(stakedAmount) * nftCount
    
    // 水象星座获得额外权重
    if (zodiacElement === 'water') {
      baseWeight *= 1.2
    }
    
    return baseWeight
  }
  
  return (
    <div className="w-full bg-gradient-to-br from-[#2A2171]/80 to-[#1C1650]/90 
      backdrop-blur-md rounded-2xl p-6 
      border border-[#6366F1]/20 
      shadow-[0_8px_32px_rgba(99,102,241,0.1)]
      hover:shadow-[#6366F1]/10 transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white/90">治理权重</h3>
        <div className="px-3 py-1.5 bg-[#6366F1]/10 rounded-lg">
          <p className="text-[#6366F1] text-sm font-medium">
            总权重: {calculateWeight()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/60 text-sm mb-2">NFT 数量</p>
          <p className="text-white text-lg font-medium">{nftCount}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/60 text-sm mb-2">质押数量</p>
          <p className="text-white text-lg font-medium">{stakedAmount} SUI</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/60 text-sm mb-2">星座元素</p>
          <p className="text-white text-lg font-medium capitalize">{zodiacElement}</p>
        </div>
      </div>
    </div>
  )
} 