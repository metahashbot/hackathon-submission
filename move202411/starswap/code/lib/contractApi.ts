import { stakeTokens as contractStakeTokens } from '../utils/contract'
import type { StakeParams, StakeResult } from './types'

export const stakeTokens = async (params: StakeParams): Promise<StakeResult> => {
  try {
    const result = await contractStakeTokens({
      amount: params.amount,
      lockPeriod: params.lockPeriod,
      element: params.element,
      signer: params.signer
    })

    if (!result.success) {
      throw new Error(result.error || 'Stake failed')
    }

    return {
      success: true,
      txId: result.txId!,
      status: result.status
    }
  } catch (error) {
    console.error('Stake error:', error)
    throw error
  }
} 