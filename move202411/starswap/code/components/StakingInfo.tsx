import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { getTotalStakingInfo } from '../utils/contract';
import { ShareButtons } from './ShareButtons';
import { StakingCharts } from './StakingCharts';
import { useContractCall } from '@/utils/contract';
import { toast } from 'sonner';

interface StakingNFT {
  id: string;
  elementType: string;
  stakeAmount: number;
  lockPeriod: number;
  lastClaimTime: number;
  estimatedRewards: number;
}

interface StakingInfo {
  totalStaked: number;
  totalRewards: number;
  nfts: StakingNFT[];
}

const ELEMENT_TYPES = ['Fire', 'Water', 'Earth', 'Air'];

export default function StakingInfo() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo>({
    totalStaked: 0,
    totalRewards: 0,
    nfts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { unstakeNFT, claimRewards } = useContractCall();

  useEffect(() => {
    async function fetchStakingInfo() {
      if (!currentAccount?.address) return;
      
      try {
        setLoading(true);
        setError('');
        const info = await getTotalStakingInfo(client);
        setStakingInfo({
          ...info,
          nfts: info.nfts || []
        });
      } catch (error) {
        console.error('Failed to fetch staking info:', error);
        setError('获取质押信息失败');
      } finally {
        setLoading(false);
      }
    }

    fetchStakingInfo();
  }, [currentAccount?.address, client]);

  const handleUnstake = async (nftId: string) => {
    try {
      await unstakeNFT(nftId);
      toast.success('解除质押成功!');
    } catch (error) {
      toast.error('解除质押失败: ' + error.message);
    }
  };

  const handleClaim = async (nftId: string) => {
    try {
      await claimRewards(nftId);
      toast.success('领取奖励成功!');
    } catch (error) {
      toast.error('领取奖励失败: ' + error.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-lg bg-red-50 text-red-600">
      {error}
    </div>
  );

  const stakingData = {
    totalStaked: "1,234,567",
    totalStakers: 789,
    avgStakeAmount: "1,564"
  };

  return (
    <div className="space-y-6">
      {/* 总览信息 */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-6 
        bg-gradient-to-br from-purple-900/40 to-indigo-900/30 
        backdrop-blur-sm border border-purple-500/20 
        rounded-xl shadow-lg shadow-purple-900/10">
        <div>
          <p className="text-purple-300 text-sm mb-1">总质押金额</p>
          <p className="text-xl font-bold text-white">{stakingInfo.totalStaked / 1e9} SUI</p>
        </div>
        <div>
          <p className="text-purple-300 text-sm mb-1">总收益</p>
          <p className="text-xl font-bold text-white">{stakingInfo.totalRewards / 1e9} SUI</p>
        </div>
      </div>

      {/* 添加图表组件 */}
      <StakingCharts 
        nfts={stakingInfo.nfts}
        totalStaked={stakingInfo.totalStaked}
      />

      {/* NFT列表 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-purple-300 mb-4">质押的NFT</h3>
        {stakingInfo.nfts.length === 0 ? (
          <p className="text-purple-400">暂无质押NFT</p>
        ) : (
          stakingInfo.nfts.map(nft => (
            <div 
              key={nft.id} 
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30
                backdrop-blur-sm border border-purple-500/20 
                rounded-xl p-6 shadow-lg shadow-purple-900/10
                hover:from-purple-800/40 hover:to-indigo-800/30 
                hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-purple-300 text-sm mb-1">元素类型</p>
                  <p className="text-white">{ELEMENT_TYPES[parseInt(nft.elementType)]}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">质押金额</p>
                  <p className="text-white">{nft.stakeAmount / 1e9} SUI</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">锁定期</p>
                  <p className="text-white">{nft.lockPeriod / (24 * 60 * 60 * 1000)} 天</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">预计收益</p>
                  <p className="text-white">{nft.estimatedRewards / 1e9} SUI</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">质押时间</p>
                  <p className="text-white">{new Date(nft.lastClaimTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">预计解锁时间</p>
                  <p className="text-white">
                    {new Date(nft.lastClaimTime + nft.lockPeriod).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ShareButtons stakingData={stakingData} />
    </div>
  );
} 