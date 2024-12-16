interface NFTPreviewProps {
  zodiacElement?: string
  amount: string
  lockPeriod: number
}

export function NFTPreview({ zodiacElement, amount, lockPeriod }: NFTPreviewProps) {
  const getMultiplier = (element?: string) => {
    const multipliers: Record<string, number> = {
      'fire': 100,
      'earth': 60,
      'air': 40,
      'water': 80
    }
    return multipliers[element?.toLowerCase() || ''] || 0
  }

  return (
    
    <div className="p-4 bg-white/5 rounded-lg mt-4">
      <h3 className="text-lg font-medium mb-2">Element NFT 预览</h3>
      <div className="space-y-2">
        <p>元素: {zodiacElement || '未选择'}</p>
        <p>收益倍数: {getMultiplier(zodiacElement)}%</p>
        <p>质押数量: {amount || '0'} SUI</p>
        <p>锁定期: {lockPeriod} 天</p>
      </div>
    </div>
  )
} 
