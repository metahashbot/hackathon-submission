interface NFTCardProps {
  id: string
  element: string
  stakeAmount: number
  lockPeriod: number
  rewards: number
  startTime: number
}

export default function NFTCard({
  id,
  element,
  stakeAmount,
  lockPeriod,
  rewards,
  startTime
}: NFTCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-4">
        <img 
          src={`/nft/${element}.png`}
          alt={`${element} NFT`}
          className="w-full rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <p>ID: {id}</p>
        <p>元素: {element}</p>
        <p>质押数量: {stakeAmount} SUI</p>
        <p>锁定期: {lockPeriod}天</p>
        <p>累计收益: {rewards} SUI</p>
        <p>开始时间: {new Date(startTime).toLocaleString()}</p>
      </div>
    </div>
  )
} 