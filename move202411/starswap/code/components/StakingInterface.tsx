'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { stakeTokens } from '@/utils/contract';
import { toast } from 'sonner';

export default function StakingInterface({ 
  zodiacElement, 
  onSuccess 
}: { 
  zodiacElement: string,
  onSuccess?: () => void 
}) {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(30);
  const { address, signAndExecuteTransactionBlock } = useWallet();
  
  const handleStake = async () => {
    const amountNum = Number(amount);
    if (!address || !amount || isNaN(amountNum) || amountNum <= 0) return;
    
    try {
      const result = await stakeTokens({
        amount: amountNum,
        lockPeriod,
        element: zodiacElement,
        signer: signAndExecuteTransactionBlock
      });
      
      if (result.success) {
        toast.success('Staking successful!');
        setAmount('');
        onSuccess?.();
      } else {
        toast.error('Staking failed');
      }
    } catch (error) {
      toast.error('Staking failed');
      console.error('Staking failed:', error);
    }
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Stake SUI</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter SUI amount"
            className="w-full p-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Lock Period</label>
          <select
            value={lockPeriod}
            onChange={(e) => setLockPeriod(Number(e.target.value))}
            className="w-full p-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>

        <button
          onClick={handleStake}
          disabled={!address || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
          className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-lg font-medium disabled:opacity-50"
        >
          Stake Now
        </button>
      </div>
    </div>
  );
}