import React, { memo, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const RatingChart = memo(({ products }) => {
  const data = useMemo(() => {
    const bins = [0, 0, 0, 0, 0]
    products.forEach(p => {
      const r = Math.floor(p.rating)
      if (r >= 1 && r <= 5) bins[r - 1]++
      else if (r > 5) bins[4]++
    })
    return bins.map((count, idx) => ({
      rating: `${idx + 1}★`,
      count,
    }))
  }, [products])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">⭐ Rating Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#8B5CF6" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

RatingChart.displayName = 'RatingChart'

export default RatingChart