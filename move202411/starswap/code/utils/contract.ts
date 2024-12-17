import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CONTRACT_CONFIG } from './contract-config';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';
import { SuiClient } from '@mysten/sui.js/client';

export const PACKAGE_ID = "0x68a0485c2327d703347481fe630e0dfec1a72cac9b1e5736a44b547ff97c599b"
export const STAKE_POOL_ID = "0x3033d051e7bf483d0530aae8eec526bbb79bf6eb32746ab2aa2cc951828902a5"
export const CLOCK_ID = "0x0000000000000000000000000000000000000000000000000000000000000006"
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

export function useContractCall() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const mintAndStake = async (elementType: number, lockPeriod: number, payment: string) => {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::element_nft::mint_and_stake`,
      arguments: [
        tx.pure(elementType),
        tx.pure(lockPeriod),
        tx.object(payment),
        tx.object(STAKE_POOL_ID),
        tx.object(CLOCK_ID)
      ]
    });

    return signAndExecute({
      transaction: tx,
    });
  };

  const unstakeNFT = async (nftId: string) => {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::element_nft::unstake`,
      arguments: [
        tx.object(nftId),
        tx.object(STAKE_POOL_ID),
        tx.object(CLOCK_ID)
      ]
    });

    return signAndExecute({
      transaction: tx,
    });
  };

  const claimRewards = async (nftId: string) => {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::element_nft::claim_rewards`,
      arguments: [
        tx.object(nftId),
        tx.object(STAKE_POOL_ID),
        tx.object(CLOCK_ID)
      ]
    });

    return signAndExecute({
      transaction: tx,
    });
  };

  return {
    mintAndStake,
    unstakeNFT,
    claimRewards
  };
}

export async function getTotalStakingInfo(client: SuiClient) {
  try {
    const poolObject = await client.getObject({
      id: STAKE_POOL_ID,
      options: {
        showContent: true
      }
    })
    
    if (!poolObject.data?.content) {
      throw new Error('Failed to fetch pool object')
    }

    // 处理数据并返回
    const content = poolObject.data.content
    return {
      totalStaked: content.fields.total_staked,
      totalRewards: content.fields.total_rewards
    }
  } catch (error) {
    console.error('Failed to fetch staking info:', error)
    throw error
  }
}