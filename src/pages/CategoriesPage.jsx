import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaTag, FaBox, FaArrowRight } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const CategoriesPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('https://dummyjson.com/products?limit=100')
      .then(res => {
        setProducts(res.data.products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const categories = {}
  products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1
  })

  const categoryColors = [
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-pink-500',
    'from-teal-500 to-cyan-500',
    'from-indigo-500 to-purple-500',
  ]

  // Handle category click - navigate to products with category filter
  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Flipkart style */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-2 rounded-xl">
              <FaTag className="w-5 h-5" />
            </span>
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse products by category
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Admin Mode
            </span>
          </div>
        )}
      </div>

      {/* Category Grid - Amazon/Flipkart style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(categories).map(([name, count], index) => (
          <div 
            key={name}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCategoryClick(name)}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${categoryColors[index % categoryColors.length]} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              <FaBox />
            </div>
            <h3 className="font-semibold text-gray-900 capitalize">{name}</h3>
            <p className="text-sm text-gray-500">{count} products</p>
            <div className="mt-3 flex items-center text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore
              <FaArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage