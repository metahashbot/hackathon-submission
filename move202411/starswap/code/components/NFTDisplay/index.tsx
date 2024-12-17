import { useEffect, useState } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import NFTCard from '@/components/NFTCard'
import DAOProposal from '@/components/DAOProposal'

export default function NFTDisplay() {
  const { currentAccount } = useWalletKit()
  const [nfts, setNfts] = useState([])
  const [showDAO, setShowDAO] = useState(false)

  useEffect(() => {
    const fetchNFTs = async () => {
      if(!currentAccount?.address) return
      // 模拟NFT数据
      setNfts([{
        id: '1',
        element: 'fire',
        stakeAmount: '1000',
        lockPeriod: 30,
        rewards: '50'
      }])
    }
    fetchNFTs()
  }, [currentAccount?.address])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nfts.map(nft => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>
      
      <div className="mt-8">
        <button
          onClick={() => setShowDAO(!showDAO)}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          {showDAO ? '返回' : '参与 DAO 治理'}
        </button>
        
        {showDAO && <DAOProposal />}
      </div>
    </div>
  )
}
