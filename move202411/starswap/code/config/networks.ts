import { ENetwork } from '@/types/network'

export const networks = {
  [ENetwork.MAINNET]: {
    url: 'https://fullnode.mainnet.sui.io',
    explorer: 'https://explorer.sui.io'
  },
  [ENetwork.TESTNET]: {
    url: 'https://fullnode.testnet.sui.io',
    explorer: 'https://explorer.testnet.sui.io'  
  },
  [ENetwork.DEVNET]: {
    url: 'https://fullnode.devnet.sui.io',
    explorer: 'https://explorer.devnet.sui.io'
  }
} as const 