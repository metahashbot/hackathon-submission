export interface StakeParams {
  amount: number;
  lockPeriod: number;
  element: string;
  address: string;
}

export interface StakeResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const mockStakeTokens = async (params: StakeParams): Promise<StakeResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功场景
  return {
    success: true,
    txHash: '0x' + Math.random().toString(16).slice(2)
  };
}; 