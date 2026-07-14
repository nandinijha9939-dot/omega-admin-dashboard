import React, { memo, useMemo } from 'react'

const CategoryDistribution = memo(({ products }) => {
  const categories = useMemo(() => {
    const map = {}
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [products])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">📂 Category Distribution</h3>
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories available</p>
        ) : (
          categories.map(([name, count]) => {
            const percentage = (count / products.length * 100).toFixed(1)
            return (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{name}</span>
                  <span className="text-gray-500">{count} ({percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
})

CategoryDistribution.displayName = 'CategoryDistribution'

export default CategoryDistribution