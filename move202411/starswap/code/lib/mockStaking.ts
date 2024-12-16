interface StakeParams {
  amount: number;
  lockPeriod: number;
  element: string;
  address: string;
}

export const mockStakeTokens = async (params: StakeParams): Promise<{success: boolean, txId: string}> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return {
    success: true,
    txId: `mock_tx_${Math.random().toString(36).substr(2, 9)}`
  };
}; 