"use client"

import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { ZodiacSelector } from './ZodiacSelector'
import { ElementBonuses } from './ElementBonuses'
import { ConnectButton } from "@/components/connect-button"
import { parseUnits } from 'ethers';
import { PACKAGE_ID, STAKE_POOL_ID, CLOCK_ID } from '@/utils/contract';
import { BirthDateSelector } from './BirthDateSelector'
import { GovernanceInfo } from './GovernanceInfo'
import { ElementNFTCard } from './ElementNFTCard'
import { StakeStatus } from './StakeStatus'
import { useContractCall } from '@/utils/contract';

export default function StakingForm() {
  const [amount, setAmount] = useState('')
  const [lockPeriod, setLockPeriod] = useState(30)
  const [zodiacElement, setZodiacElement] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string>()
  const [nftInfo, setNftInfo] = useState<any>()
  const [rewards, setRewards] = useState('0')

  const client = useSuiClient()
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const { stakeNFT } = useContractCall();

  if (!STAKE_POOL_ID || !CLOCK_ID) {
    console.error("Missing contract constants:", { STAKE_POOL_ID, CLOCK_ID });
    toast({
      title: '错误',
      description: '合约配置错误',
      variant: 'destructive'
    });
    return;
  }

  const getZodiacElementNumber = (element: string | undefined): number => {
    if (!element) return 0;
    
    const elementMap: { [key: string]: number } = {
      'fire': 0,
      'water': 1,
      'earth': 2,
      'air': 3
    };
    
    const normalizedElement = element.toLowerCase().trim();
    return elementMap[normalizedElement] ?? 0;
  };

  const handleStake = async () => {
    if (loading || !currentAccount) return;
    
    console.log('开始质押按钮被点击');
    console.log('当前状态:', { currentAccount, amount, zodiacElement, loading });

    const amountNum = Number(amount);
    if (!currentAccount.address || !amount || !zodiacElement || isNaN(amountNum) || amountNum <= 0) {
      toast.error('请填写完整的质押信息');
      return;
    }

    setLoading(true);
    try {
      console.log('创建交易...');
      const tx = new TransactionBlock();
      
      // 设置 gas 预算
      tx.setGasBudget(10000000);
      console.log('Gas预算设置完成');

      // 从 gas coin 中分割出质押金额
      const amountMist = amountNum * 1_000_000_000; // 转换为 MIST 单位
      const [coin] = tx.splitCoins(tx.gas, [amountMist]);
      console.log('分割代币金额:', amountMist);

      // 获取元素类型编号
      const elementNumber = getZodiacElementNumber(zodiacElement);
      console.log('元素类型编号:', elementNumber);

      // 转换锁定期为毫秒
      const lockPeriodMs = lockPeriod * 24 * 60 * 60 * 1000;
      console.log('锁定期(毫秒):', lockPeriodMs);

      console.log('准备调用合约:', { PACKAGE_ID, STAKE_POOL_ID, CLOCK_ID });

      // 构建合约调用
      tx.moveCall({
        target: `${PACKAGE_ID}::element_nft::mint_and_stake`,
        arguments: [
          tx.pure(elementNumber), // element_type: u8
          tx.pure(lockPeriodMs), // lock_period: u64
          coin, // payment: Coin<SUI>
          tx.object(STAKE_POOL_ID), // pool: &StakePool
          tx.object(CLOCK_ID), // clock: &Clock
        ],
      });

      console.log('交易构建完成,准备发送...');
      if (!currentAccount.address) {
        toast.error('请先连接钱包');
        return;
      }

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:testnet',
      });


      console.log('交易结果:', result);

      if (result) {
        setTxHash(result.digest);
        const nftInfo = {
          element: zodiacElement,
          stakeAmount: amount,
          lockPeriod: lockPeriod,
          lastClaimTime: Date.now()
        };
        setNftInfo(nftInfo);
        toast.success('质押成功!');
      }
    } catch (error: any) {
      console.error('质押失败:', error);
      toast.error('质押失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 在组件初始化时检查环境
  useEffect(() => {
    console.log('环境检查:', {
      wallet: {
        isConnected: currentAccount !== null,
        address: currentAccount?.address,
        network: client?.options?.url
      },
      contract: {
        packageId: PACKAGE_ID,
        stakePoolId: STAKE_POOL_ID,
        clockId: CLOCK_ID
      }
    });
  }, [currentAccount, client]);

  // 在交易发送前检查所有参数
  const validateTransaction = (tx: TransactionBlock) => {
    console.log('交易验证:', {
      sender: currentAccount?.address,
      gasBudget: tx.blockData.gasConfig,
      moveCall: tx.blockData.transactions[0]
    });
    return true;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="mb-4">
            <ConnectButton className="bg-amber-500 hover:bg-amber-600 text-white" />
          </div>
          
          <ZodiacSelector onElementSelect={setZodiacElement} />
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">质押数量 (SUI)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-3 bg-purple-800/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 text-white placeholder-purple-300"
                min="0"
                placeholder="输入 SUI 数量"
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">锁定期</label>
              <select
                value={lockPeriod}
                onChange={e => setLockPeriod(Number(e.target.value))}
                className="w-full p-3 bg-purple-800/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
              >
                <option value={30}>30 天</option>
                <option value={60}>60 天</option>
                <option value={90}>90 天</option>
              </select>
            </div>
            
            {txHash && (
              <div className="text-sm">
                交易Hash: <a 
                  href={`https://testnet.suivision.xyz/txblock/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {txHash.slice(0,6)}...{txHash.slice(-4)}
                </a>
              </div>
            )}

            <button
              onClick={handleStake}
              disabled={loading || !currentAccount || !amount || !zodiacElement || isNaN(Number(amount)) || Number(amount) <= 0}
              className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? '处理中...' : '开始质押'}
            </button>
          </div>
        </div>
        
        <div>
          <ElementBonuses />
        </div>
      </div>
      
      {nftInfo && (
        <>
          <ElementNFTCard
            element={nftInfo.element}
            stakeAmount={nftInfo.stakeAmount}
            lockPeriod={nftInfo.lockPeriod}
            lastClaimTime={nftInfo.lastClaimTime}
            multiplier={getElementMultiplier(nftInfo.element)}
            unlockReduction={getUnlockReduction(nftInfo.element)}
            governanceWeight={getGovernanceWeight(nftInfo.element)}
          />

          <StakeStatus 
            nft={nftInfo}
            rewards={rewards}
          />
        </>
      )}
    </div>
  )
}