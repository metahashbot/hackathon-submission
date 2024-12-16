"use client"

import { useState } from 'react'
import { useContract } from '../hooks/useContract'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { PACKAGE_ID, STAKE_POOL_ID, CLOCK_ID } from '../utils/contract'
import { toast } from 'sonner'
import { useCurrentAccount } from '@mysten/dapp-kit'

export function TestMintForm() {
  const { callContract, isLoading } = useContract()
  const currentAccount = useCurrentAccount()
  
  const [formData, setFormData] = useState({
    elementType: 0,
    lockPeriod: 86400000,
    payment: "0xb337bf77a4ceb6678e6c16402733dc3d348f7ac3006df0d6af99fd3e2fb189b9"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAccount) {
      toast.error('请先连接钱包')
      return
    }

    const tx = new TransactionBlock()
    
    // 设置 gas budget
    tx.setGasBudget(10000000)
    
    tx.moveCall({
      target: `${PACKAGE_ID}::element_nft::mint_and_stake`,
      arguments: [
        tx.pure(formData.elementType),
        tx.pure(formData.lockPeriod),
        tx.object(formData.payment),
        tx.object(STAKE_POOL_ID),
        tx.object(CLOCK_ID)
      ]
    })

    await callContract(tx)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">测试 Mint & Stake</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Element Type
          </label>
          <input
            type="number"
            value={formData.elementType}
            onChange={e => setFormData(prev => ({
              ...prev,
              elementType: parseInt(e.target.value)
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lock Period (ms)
          </label>
          <input
            type="number"
            value={formData.lockPeriod}
            onChange={e => setFormData(prev => ({
              ...prev,
              lockPeriod: parseInt(e.target.value)
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Coin ID
          </label>
          <input
            type="text"
            value={formData.payment}
            onChange={e => setFormData(prev => ({
              ...prev,
              payment: e.target.value
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? '处理中...' : '提交'}
        </button>
      </form>
    </div>
  )
} 