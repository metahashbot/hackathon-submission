import { useEffect, useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { getElections } from '../utils/sui';

export interface Election {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  admin: string;
}

export const useElectionData = () => {
  const { currentAccount } = useWalletKit();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentAccount) {
        console.log('未连接钱包，清空选举列表');
        setElections([]);
        return;
      }

      console.log('获取选举列表:', currentAccount.address);
      const data = await getElections(currentAccount.address);
      console.log('选举列表数据:', data);

      // 解析选举数据
      const parsedElections = data.map(item => {
        const content = item.data?.content;
        if (!content) {
          console.log('无法解析选举数据:', item);
          return null;
        }

        const fields = content.fields;
        if (!fields) {
          console.log('无法解析选举字段:', content);
          return null;
        }

        try {
          const election: Election = {
            id: item.data?.objectId || '',
            name: fields.name || '',
            description: fields.description || '',
            startTime: Number(fields.start_time) || 0,
            endTime: Number(fields.end_time) || 0,
            admin: fields.admin || '',
          };

          console.log('解析后的选举:', election);
          return election;
        } catch (err) {
          console.error('解析选举数据时出错:', err);
          return null;
        }
      }).filter((election): election is Election => election !== null);

      console.log('解析后的选举列表:', parsedElections);
      setElections(parsedElections);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载选举列表失败';
      console.error('获取选举列表失败:', errorMessage);
      setError(errorMessage);
      setElections([]); // 清空选举列表
    } finally {
      setLoading(false);
    }
  };

  // 当账户变化时重新获取数据
  useEffect(() => {
    console.log('账户变化，重新获取选举列表');
    fetchElections();
  }, [currentAccount]);

  // 定期刷新数据
  useEffect(() => {
    if (!currentAccount) {
      console.log('未连接钱包，跳过定期刷新');
      return;
    }

    console.log('设置定期刷新');
    const interval = setInterval(fetchElections, 10000); // 每10秒刷新一次

    return () => {
      console.log('清除定期刷新');
      clearInterval(interval);
    };
  }, [currentAccount]);

  return { elections, loading, error, refetch: fetchElections };
};
