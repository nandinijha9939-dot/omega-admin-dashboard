import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { 
  FaTag, 
  FaBox, 
  FaArrowRight,
  FaPaintBrush,
  FaGem,
  FaCouch,
  FaAppleAlt,
  FaHome,
  FaUtensils,
  FaLaptop,
  FaTshirt,
  FaShoePrints,
  FaClock,
  FaMobileAlt,
  FaCamera,
  FaHeadphones,
  FaBook,
  FaRunning,
  FaBaby,
  FaDog,
  FaCar,
  FaGift,
  FaHeart,
  FaStar
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Common/Breadcrumb'

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

  // Category icons mapping - Flipkart/Amazon style
  const categoryIcons = {
    'beauty': { icon: FaPaintBrush, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-100' },
    'fragrances': { icon: FaGem, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-100' },
    'furniture': { icon: FaCouch, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-100' },
    'groceries': { icon: FaAppleAlt, color: 'from-green-500 to-emerald-500', bg: 'bg-green-100' },
    'home-decoration': { icon: FaHome, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-100' },
    'kitchen-accessories': { icon: FaUtensils, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-100' },
    'laptops': { icon: FaLaptop, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100' },
    'mens-shirts': { icon: FaTshirt, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-100' },
    'mens-shoes': { icon: FaShoePrints, color: 'from-gray-600 to-gray-800', bg: 'bg-gray-100' },
    'mens-watches': { icon: FaClock, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-100' },
    'mobile-accessories': { icon: FaMobileAlt, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-100' },
    'smartphones': { icon: FaMobileAlt, color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-100' },
    'sunglasses': { icon: FaCamera, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100' },
    'tablets': { icon: FaLaptop, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-100' },
    'tops': { icon: FaTshirt, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-100' },
    'womens-bags': { icon: FaGift, color: 'from-fuchsia-500 to-pink-500', bg: 'bg-fuchsia-100' },
    'womens-dresses': { icon: FaHeart, color: 'from-red-500 to-pink-500', bg: 'bg-red-100' },
    'womens-jewellery': { icon: FaGem, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-100' },
    'womens-shoes': { icon: FaShoePrints, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-100' },
    'womens-watches': { icon: FaClock, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-100' },
  }

  // Default icon for unknown categories
  const defaultIcon = { icon: FaTag, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' }

  const getCategoryIcon = (categoryName) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '-')
    return categoryIcons[key] || defaultIcon
  }

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

  // Sort categories by count (most products first)
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-1.5 sm:p-2 rounded-xl">
              <FaTag className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Browse products by category
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
              Admin Mode
            </span>
          </div>
        )}
      </div>

      {/* Category Grid - Flipkart/Amazon style with icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {sortedCategories.map(([name, count]) => {
          const { icon: Icon, color, bg } = getCategoryIcon(name)
          return (
            <div 
              key={name}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCategoryClick(name)}
            >
              {/* Category Image/Icon - Flipkart style */}
              <div className={`relative h-24 sm:h-28 md:h-32 flex items-center justify-center ${bg}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon />
                </div>
                {/* Decorative elements - Amazon style */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              </div>

              {/* Category Info */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 capitalize text-sm sm:text-base truncate">
                  {name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {count} products
                  </p>
                  <div className="flex items-center text-xs sm:text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <FaArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Admin additional options */}
      {isAdmin && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-gray-900">Category Management</h4>
              <p className="text-sm text-gray-500">Add, edit or remove categories</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full sm:w-auto text-sm">
              Manage Categories
            </button>
          </div>
        </div>
      )}

      {/* Empty state - just in case */}
      {sortedCategories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
          <p className="text-gray-500 text-sm">Try adding some products first</p>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage