// 部署后替换为实际的合约ID
export const CONTRACT_CONFIG = {
  PACKAGE_ID: "0x...", // 替换为实际的包ID
  MODULE_NAME: "starswap",
  FUNCTIONS: {
    STAKE: "stake_nft",
    UNSTAKE: "unstake_nft",
    CLAIM_REWARDS: "claim_rewards"
  }
} as const; 