import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa'
import toast from 'react-hot-toast'
import CountUp from 'react-countup'
import ProductSkeleton from '../components/Common/ProductSkeleton'
import EmptyState from '../components/Common/EmptyState'
import Breadcrumb from '../components/Common/Breadcrumb'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const categoryFromURL = searchParams.get('category') || ''
  const searchFromURL = searchParams.get('search') || ''

  const [search, setSearch] = useState(searchFromURL)
  const [category, setCategory] = useState(categoryFromURL)
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://dummyjson.com/products?limit=100')
        // Add published flag to all products
        const productsWithPublished = response.data.products.map(p => ({
          ...p,
          published: true
        }))
        setProducts(productsWithPublished)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]
    
    // User sees only published products
    if (!isAdmin) {
      result = result.filter(p => p.published !== false)
    }
    
    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    }
    
    // Category filter
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    
    // Sorting
    switch(sortBy) {
      case 'popular':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }
    
    return result
  }, [products, search, category, sortBy, isAdmin])

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    setSearchParams(params, { replace: true })
  }, [category, search, setSearchParams])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const categories = [...new Set(products.map(p => p.category))]

  // Stats for admin
  const stats = useMemo(() => {
    const total = filtered.length
    const avgRating = total > 0 ? filtered.reduce((s, p) => s + p.rating, 0) / total : 0
    const totalValue = filtered.reduce((s, p) => s + p.price * p.stock, 0)
    return { total, avgRating, totalValue }
  }, [filtered])

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5 ? 1 : 0
    const empty = 5 - full - half
    return (
      <>
        {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400" />)}
        {half === 1 && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400" />)}
      </>
    )
  }

  // Highlight search text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <span key={i} className="bg-yellow-200 px-0.5 rounded">{part}</span> 
        : part
    )
  }

  const clearCategoryFilter = useCallback(() => {
    setCategory('')
    setSearch('')
    setCurrentPage(1)
  }, [])

  // Toggle publish (Admin only)
  const togglePublish = useCallback((productId, e) => {
    e.stopPropagation()
    if (!isAdmin) return
    
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, published: !p.published } 
          : p
      )
    )
    
    const product = products.find(p => p.id === productId)
    toast.success(product?.published ? '✅ Product Published' : '🚫 Product Hidden')
  }, [isAdmin, products])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb />

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold text-gray-900">
              <CountUp end={stats.total} duration={1.5} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Average Rating</div>
            <div className="text-2xl font-bold text-gray-900">
              <CountUp end={stats.avgRating} duration={1.5} decimals={1} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Inventory Value</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹<CountUp end={stats.totalValue * 83} duration={1.5} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-2 rounded-xl">
              <FaShoppingCart className="w-5 h-5" />
            </span>
            Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} products available
            {category && <span className="text-purple-600 font-medium"> in {category}</span>}
          </p>
        </div>
        {category && (
          <button 
            onClick={clearCategoryFilter}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear Filter ✕
          </button>
        )}
        {isAdmin && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              Admin Mode
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products... (⌘K)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[140px]"
          >
            <option value="popular">Sort by: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          
          <button
            onClick={() => { setSearch(''); setCategory(''); setCurrentPage(1) }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <EmptyState 
          icon="🔍"
          title="No products match your filters"
          description="Try clearing filters or searching for another product"
          actionText="Clear Filters"
          onAction={clearCategoryFilter}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative bg-white p-4 h-48 flex items-center justify-center">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaHeart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                  
                  {product.stock > 0 ? (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                      Out of Stock
                    </span>
                  )}

                  {/* Admin: Publish toggle */}
                  {isAdmin && (
                    <button
                      onClick={(e) => togglePublish(product.id, e)}
                      className={`absolute top-2 left-2 px-2 py-0.5 text-xs rounded-full transition ${
                        product.published 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.published ? 'Published' : 'Hidden'}
                    </button>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 h-10">
                    {highlightText(product.title, search)}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5 text-xs">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-lg font-bold text-gray-900">₹{Math.round(product.price * 83)}</span>
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₹{Math.round(product.price * 83 * 1.4)}
                    </span>
                    <span className="text-xs text-green-600 ml-2">40% off</span>
                  </div>
                  
                  <div className="mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {product.stock > 0 && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      Free Delivery
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} products
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                
                {(() => {
                  const pages = []
                  const maxVisible = 5
                  if (totalPages <= maxVisible) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                  } else if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i)
                    pages.push('...')
                    pages.push(totalPages)
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
                  } else {
                    pages.push(1)
                    pages.push('...')
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                    pages.push('...')
                    pages.push(totalPages)
                  }
                  return pages.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${
                        page === currentPage
                          ? 'bg-purple-600 text-white'
                          : typeof page === 'number'
                          ? 'border border-gray-300 hover:bg-gray-50'
                          : 'text-gray-400 cursor-default'
                      }`}
                    >
                      {page}
                    </button>
                  ))
                })()}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage