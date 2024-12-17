"use client"

import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { toast } from 'sonner'
import { useState } from 'react'
import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard'

interface ContractCallOptions {
  onSuccess?: (data: SuiSignAndExecuteTransactionOutput) => void
  onError?: (error: Error) => void
}

export function useContract() {
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [isLoading, setIsLoading] = useState(false)

  const callContract = async (tx: TransactionBlock, options?: ContractCallOptions) => {
    try {
      setIsLoading(true)
      const toastId = toast.loading('处理中...')
      
      const result = await signAndExecute({
        transaction: tx
      })
      
      if (!result) {
        throw new Error('交易执行失败')
      }

      await client.waitForTransaction({
        digest: result.digest
      })

      toast.success('交易成功!', { id: toastId })
      options?.onSuccess?.(result)
      return result
    } catch (e) {
      const error = e as Error
      toast.error('交易失败: ' + error.message)
      options?.onError?.(error)
      console.error('Contract call failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { callContract, isLoading }
} 