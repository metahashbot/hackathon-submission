import { useContractCall } from '@/utils/contract';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TestForm() {
  const [elementType, setElementType] = useState('0');
  const [lockPeriod, setLockPeriod] = useState('86400000');
  const [payment, setPayment] = useState('0xb337bf77a4ceb6678e6c16402733dc3d348f7ac3006df0d6af99fd3e2fb189b9');
  const [loading, setLoading] = useState(false);

  const { mintAndStake } = useContractCall();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await mintAndStake(
        Number(elementType),
        Number(lockPeriod),
        payment
      );
      
      console.log('Transaction result:', result);
      toast.success('Transaction successful!');
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Test Mint And Stake</h2>
      
      <div>
        <label className="block text-sm font-medium">Element Type</label>
        <input
          type="text"
          value={elementType}
          onChange={(e) => setElementType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Lock Period (ms)</label>
        <input
          type="text"
          value={lockPeriod}
          onChange={(e) => setLockPeriod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Payment Coin ID</label>
        <input
          type="text"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
} 