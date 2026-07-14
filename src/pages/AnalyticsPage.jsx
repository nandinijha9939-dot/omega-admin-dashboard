import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { 
  FaBox, 
  FaStar, 
  FaDollarSign, 
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'

const AnalyticsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    axios.get('https://dummyjson.com/products?limit=100')
      .then(res => { 
        setProducts(res.data.products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only administrators can view analytics</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const total = products.length
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / total).toFixed(1)
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const categories = [...new Set(products.map(p => p.category))]
  
  const catCount = {}
  products.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1 })

  const stats = [
    { 
      label: 'Total Products', 
      value: total, 
      icon: FaBox, 
      color: 'bg-purple-100 text-purple-600',
      change: '+12%',
      up: true
    },
    { 
      label: 'Average Rating', 
      value: avgRating, 
      icon: FaStar, 
      color: 'bg-yellow-100 text-yellow-600',
      change: '+0.3',
      up: true
    },
    { 
      label: 'Inventory Value', 
      value: `₹${(totalValue * 83).toLocaleString()}`, 
      icon: FaDollarSign, 
      color: 'bg-green-100 text-green-600',
      change: '+18%',
      up: true
    },
    { 
      label: 'Categories', 
      value: categories.length, 
      icon: FaTags, 
      color: 'bg-blue-100 text-blue-600',
      change: '0',
      up: false
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-2 rounded-xl">
              <FaChartLine className="w-5 h-5" />
            </span>
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your store performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Admin View
          </span>
        </div>
      </div>

      {/* Stats Grid - Amazon/Flipkart style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.up ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution - Amazon style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaTags className="text-purple-600" />
            Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(catCount).map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{name}</span>
                  <span className="text-gray-500">{count} ({((count/total)*100).toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count/total)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution - Amazon style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5,4,3,2,1].map(rating => {
              const count = products.filter(p => Math.floor(p.rating) === rating).length
              const percentage = (count / total * 100) || 0
              const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']
              return (
                <div key={rating}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{rating} ★</span>
                    <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colors[5 - rating]
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions - Admin only */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6 text-center">
          <div className="text-2xl mb-2">🛒</div>
          <div className="font-semibold text-gray-900">Manage Products</div>
          <div className="text-sm text-gray-500">{total} products</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-6 text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="font-semibold text-gray-900">View Customers</div>
          <div className="text-sm text-gray-500">1,248 customers</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 text-center">
          <div className="text-2xl mb-2">📦</div>
          <div className="font-semibold text-gray-900">Orders Today</div>
          <div className="text-sm text-gray-500">24 orders</div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage