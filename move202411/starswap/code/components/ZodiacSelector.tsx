import { useState, useEffect } from 'react';
import { useWallet } from './providers/wallet-provider';
import { TransactionBlock } from '@mysten/sui.js/transactions';


// 星座元素枚举
export enum ElementType {
    FIRE = 1,
    EARTH = 2,
    AIR = 3,
    WATER = 4
}

// 星座信息类型
type ZodiacInfo = {
    sign: string;
    element: ElementType;
};

export function ZodiacSelector({ onElementSelect }: ZodiacSelectorProps) {
    const [selectedZodiac, setSelectedZodiac] = useState<string>('');
    const [amount, setAmount] = useState('');
    const { address, signAndExecuteTransaction } = useWallet();

    // 星座信息映射
    const zodiacData: { [key: string]: ZodiacInfo } = {
        '白羊座': { sign: '白羊座', element: ElementType.FIRE },
        '金牛座': { sign: '金牛座', element: ElementType.EARTH },
        '双子座': { sign: '双子座', element: ElementType.AIR },
        '巨蟹座': { sign: '巨蟹座', element: ElementType.WATER },
        '狮子座': { sign: '狮子座', element: ElementType.FIRE },
        '处女座': { sign: '处女座', element: ElementType.EARTH },
        '天秤座': { sign: '天秤座', element: ElementType.AIR },
        '天蝎座': { sign: '天蝎座', element: ElementType.WATER },
        '射手座': { sign: '射手座', element: ElementType.FIRE },
        '摩羯座': { sign: '摩羯座', element: ElementType.EARTH },
        '水瓶座': { sign: '水瓶座', element: ElementType.AIR },
        '双鱼座': { sign: '双鱼座', element: ElementType.WATER },
    };

    const zodiacInfo = selectedZodiac ? zodiacData[selectedZodiac] : { sign: '', element: ElementType.FIRE };

    const handleZodiacChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedZodiac(event.target.value);
    };

    const getElementName = (element: ElementType): string => {
        switch (element) {
            case ElementType.FIRE: return "火";
            case ElementType.EARTH: return "土";
            case ElementType.AIR: return "风";
            case ElementType.WATER: return "水";
            default: return "未知";
        }
    };
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
                    tx.pure(zodiacInfo.element),
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

    useEffect(() => {
        onElementSelect(zodiacInfo.element);
    }, [zodiacInfo.element, onElementSelect]);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">选择你的星座</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">星座</label>
                    <select
                        value={selectedZodiac}
                        onChange={handleZodiacChange}
                        className="w-full p-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="">请选择</option>
                        {Object.keys(zodiacData).map((sign) => (
                            <option key={sign} value={sign}>{sign}</option>
                        ))}
                    </select>
                </div>
                {zodiacInfo.sign && (
                    <div className="text-lg">
                        <p>你的星座: {zodiacInfo.sign}</p>
                        <p>元素: {getElementName(zodiacInfo.element)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}