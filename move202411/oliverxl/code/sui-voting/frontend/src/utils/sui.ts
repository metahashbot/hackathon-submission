import { QueryClient } from '@tanstack/react-query';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { type WalletAccount } from '@mysten/wallet-standard';
import { type SignAndExecuteTransactionBlockCallback } from '@mysten/wallet-kit';

// 配置
export const NETWORK = 'testnet';
export const PACKAGE_ID = '0x6a5885aa29ad65a8c6bc0a1bd2e51cba435ca0818d24f97739c602395c670ffb';

// 创建 SUI 客户端
export const suiClient = new SuiClient({
    url: getFullnodeUrl(NETWORK)
});

// 创建 QueryClient 实例
export const queryClient = new QueryClient();

// 辅助函数：将字符串转换为 UTF-8 字节数组
function stringToUtf8Bytes(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
}

// API 函数
export async function createElection(
    account: WalletAccount,
    signAndExecuteTransactionBlock: SignAndExecuteTransactionBlockCallback,
    name: string,
    description: string,
    startTime: string,
    endTime: string
) {
    try {
        console.log('创建选举 - 输入参数:', {
            accountAddress: account.address,
            accountChain: account.chains,
            accountFeatures: account.features,
            name,
            description,
            startTime,
            endTime
        });

        const tx = new TransactionBlock();
        tx.setGasBudget(100000000);

        // 将字符串转换为 UTF-8 字节数组
        const nameBytes = tx.pure(stringToUtf8Bytes(name));
        const descriptionBytes = tx.pure(stringToUtf8Bytes(description));
        const startTimeMs = tx.pure(new Date(startTime).getTime());
        const endTimeMs = tx.pure(new Date(endTime).getTime());

        // 调用创建选举函数
        const [election] = tx.moveCall({
            target: `${PACKAGE_ID}::voting::create_election`,
            arguments: [
                nameBytes,
                descriptionBytes,
                startTimeMs,
                endTimeMs
            ]
        });
        
        console.log('交易块已创建:', tx);
        
        const result = await signAndExecuteTransactionBlock({
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
        console.log('交易已执行:', result);

        // 从事件中获取选举 ID
        const electionCreatedEvent = result.events?.find(event => 
            event.type === `${PACKAGE_ID}::voting::ElectionCreated`
        );
        console.log('选举创建事件:', electionCreatedEvent);

        // 从对象变更中获取创建的选举对象
        const createdObject = result.objectChanges?.find(change => 
            change.type === 'created' && 
            change.objectType === `${PACKAGE_ID}::voting::Election`
        );
        console.log('创建的选举对象:', createdObject);

        if (createdObject?.objectId) {
            // 获取选举对象的详细信息
            const electionDetails = await suiClient.getObject({
                id: createdObject.objectId,
                options: {
                    showType: true,
                    showContent: true,
                    showOwner: true,
                }
            });
            console.log('选举对象详细信息:', electionDetails);
        }
        
        return result;
    } catch (error) {
        console.error('创建选举失败:', error);
        throw error;
    }
}

// 投票函数
export async function castVote(
    account: WalletAccount,
    signAndExecuteTransactionBlock: SignAndExecuteTransactionBlockCallback,
    electionId: string,
    encryptedVote: string
): Promise<void> {
    try {
        const tx = new TransactionBlock();
        tx.setGasBudget(100000000);
        
        tx.moveCall({
            target: `${PACKAGE_ID}::voting::cast_vote`,
            arguments: [
                tx.pure(electionId),
                tx.pure(stringToUtf8Bytes(encryptedVote))
            ]
        });

        console.log('交易块已创建:', tx);

        const result = await signAndExecuteTransactionBlock({
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        console.log('交易已执行:', result);
    } catch (error) {
        console.error('投票失败:', error);
        throw error;
    }
}

// 获取选举列表
export async function getElections(walletAddress?: string) {
    try {
        console.log('获取选举列表 - 输入参数:', {
            walletAddress
        });

        // 获取所有选举对象
        const elections = await suiClient.getOwnedObjects({
            owner: walletAddress || '',
            options: {
                showType: true,
                showContent: true,
                showOwner: true,
            }
        });

        console.log('获取到的选举对象:', elections);
        console.log('选举对象数据详情:', JSON.stringify(elections.data, null, 2));

        // 过滤出选举对象
        const electionObjects = elections.data.filter(obj => {
            console.log('检查对象:', obj);
            console.log('对象类型:', obj.data?.type);
            return obj.data?.type?.includes(`${PACKAGE_ID}::voting::Election`);
        });

        console.log('过滤后的选举对象:', electionObjects);

        // 获取选举详细信息
        const electionDetails = await Promise.all(
            electionObjects.map(async (election) => {
                try {
                    const details = await suiClient.getObject({
                        id: election.data?.objectId || '',
                        options: {
                            showType: true,
                            showContent: true,
                            showOwner: true,
                        }
                    });
                    console.log('选举详细信息:', details);
                    return details;
                } catch (error) {
                    console.error('获取选举详细信息失败:', error);
                    return null;
                }
            })
        );

        console.log('选举详细信息列表:', electionDetails);
        
        return electionDetails.filter(detail => detail !== null);
    } catch (error) {
        console.error('获取选举列表失败:', error);
        throw error;
    }
}

// 获取投票记录
export async function getVotes() {
    try {
        const events = await suiClient.queryEvents({
            query: {
                MoveEventType: `${PACKAGE_ID}::voting::VoteEvent`
            }
        });
        
        return events.data;
    } catch (error) {
        console.error('获取投票记录失败:', error);
        throw error;
    }
}