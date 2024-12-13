import { useState } from 'react';
import { useWallet } from './providers/wallet-provider';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { ElementType } from './ZodiacSelector';

export function StakingInterface({ zodiacElement }: { zodiacElement: ElementType }) {
    const [amount, setAmount] = useState('');
    const { address, signAndExecuteTransaction } = useWallet();
    
    const handleStake = async () => {
        if (!address || !amount) return;
        
        try {
            const tx = new TransactionBlock();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(Number(amount))]);
            
            tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::staking_pool::stake`,
                arguments: [
                    coin,
                    tx.pure(Number(amount)),
                    tx.pure(30), // 默认锁定期30天
                    tx.pure(zodiacElement),
                ],
            });
            
            const result = await signAndExecuteTransaction({
                transaction: tx,
            });
            
            console.log('Staking successful:', result);
            setAmount('');
        } catch (error) {
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
                <button
                    onClick={handleStake}
                    disabled={!address || !amount}
                    className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-lg font-medium disabled:opacity-50"
                >
                    Stake Now
                </button>
            </div>
        </div>
    );
}