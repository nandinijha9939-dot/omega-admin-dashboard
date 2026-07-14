import React, { memo, useMemo } from 'react'
import { FaBox, FaStar, FaDollarSign, FaTags } from 'react-icons/fa'
import { useProducts } from '../../hooks/useProducts'

const ProductStats = memo(({ isAdmin }) => {
  // Use the same products data from context
  const { products } = useProducts()
  
  const stats = useMemo(() => {
    const total = products.length
    const avgRating = total > 0 
      ? products.reduce((sum, p) => sum + p.rating, 0) / total 
      : 0
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const categories = new Set(products.map(p => p.category)).size
    
    return { total, avgRating, totalValue, categories }
  }, [products])

  const statItems = [
    { 
      label: 'Total Products', 
      value: stats.total, 
      icon: FaBox, 
      color: 'bg-purple-100 text-purple-600' 
    },
    { 
      label: 'Average Rating', 
      value: stats.avgRating.toFixed(1), 
      icon: FaStar, 
      color: 'bg-orange-100 text-orange-600' 
    },
    { 
      label: 'Inventory Value', 
      value: `$${stats.totalValue.toLocaleString()}`, 
      icon: FaDollarSign, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      label: 'Categories', 
      value: stats.categories, 
      icon: FaTags, 
      color: 'bg-blue-100 text-blue-600' 
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{item.label}</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{item.value}</div>
        </div>
      ))}
    </div>
  )
})

ProductStats.displayName = 'ProductStats'

export default ProductStats