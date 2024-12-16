'use client'

import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data: Array<{ value: number; label: string }>
  className?: string
}

export function LineChart({ data, className }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

