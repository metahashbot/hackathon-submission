import { useEffect, useState } from 'react';
import { useWallet } from './providers/wallet-provider';
import { JsonRpcProvider } from '@mysten/sui.js/client';

export function RewardsDisplay() {
    const [rewards, setRewards] = useState('0');
    const [stakedAmount, setStakedAmount] = useState('0');
    const { address } = useWallet();
    
    useEffect(() => {
        const fetchStakingInfo = async () => {
            if (!address) return;
            
            try {
                const provider = new JsonRpcProvider();
                
                // 获取质押信息
                const stakingPool = await provider.getObject({
                    id: process.env.NEXT_PUBLIC_STAKING_POOL_ID!,
                    options: { showContent: true }
                });
                
                // 获取用户的 NFT 信息
                const nfts = await provider.getOwnedObjects({
                    owner: address,
                    filter: {
                        Package: process.env.NEXT_PUBLIC_PACKAGE_ID!
                    }
                });
                
                if (stakingPool && nfts.data.length > 0) {
                    // 更新质押信息
                    const nftData = nfts.data[0];
                    setStakedAmount(nftData.data?.content?.fields?.stake_amount || '0');
                    setRewards(nftData.data?.content?.fields?.rewards || '0');
                }
            } catch (error) {
                console.error('Error fetching staking info:', error);
            }
        };
        
        fetchStakingInfo();
        // 每30秒更新一次数据
        const interval = setInterval(fetchStakingInfo, 30000);
        
        return () => clearInterval(interval);
    }, [address]);
    
    return (
        <div className="p-4 rounded-lg border">
            <h3 className="text-xl font-bold mb-4">质押状态</h3>
            <div className="space-y-2">
                <p className="text-lg">质押数量：<span className="font-semibold">{Number(stakedAmount) / 1e9} SUI</span></p>
                <p className="text-lg">当前收益：<span className="font-semibold">{Number(rewards) / 1e9} SUI</span></p>
            </div>
        </div>
    );
}