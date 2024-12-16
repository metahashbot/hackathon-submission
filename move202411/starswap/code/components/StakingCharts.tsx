import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StakingNFT } from './StakingInfo';

interface StakingChartsProps {
  nfts: StakingNFT[];
  totalStaked: number;
}

export function StakingCharts({ nfts, totalStaked }: StakingChartsProps) {
  // 计算元素类型分布
  const elementDistribution = nfts.reduce((acc, nft) => {
    const element = ['Fire', 'Water', 'Earth', 'Air'][parseInt(nft.elementType)];
    acc[element] = (acc[element] || 0) + nft.stakeAmount / 1e9;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(elementDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // 按时间排序的质押数据
  const timelineData = nfts
    .sort((a, b) => a.lastClaimTime - b.lastClaimTime)
    .map(nft => ({
      time: new Date(nft.lastClaimTime).toLocaleDateString(),
      amount: nft.stakeAmount / 1e9,
    }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 元素分布饼图 */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 
          backdrop-blur-sm border border-purple-500/20 
          rounded-xl p-6 shadow-lg shadow-purple-900/10">
          <h3 className="text-purple-300 font-semibold mb-4">元素分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 32, 44, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-purple-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 质押趋势图 */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 
          backdrop-blur-sm border border-purple-500/20 
          rounded-xl p-6 shadow-lg shadow-purple-900/10">
          <h3 className="text-purple-300 font-semibold mb-4">质押趋势</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#A78BFA" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  stroke="#A78BFA" 
                  tick={{ fill: '#A78BFA' }}
                />
                <YAxis 
                  stroke="#A78BFA"
                  tick={{ fill: '#A78BFA' }}
                  label={{ 
                    value: 'SUI', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#A78BFA'
                  }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 32, 44, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 