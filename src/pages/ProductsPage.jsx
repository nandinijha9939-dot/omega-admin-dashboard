import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa'
import toast from 'react-hot-toast'
import CountUp from 'react-countup'
import ProductSkeleton from '../components/Common/ProductSkeleton'
import EmptyState from '../components/Common/EmptyState'
import Breadcrumb from '../components/Common/Breadcrumb'
import MultiCategoryFilter from '../components/Products/MultiCategoryFilter'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  // Wishlist state - saved in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('omega_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Get filters from URL
  const initialSearch = searchParams.get('search') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialSort = searchParams.get('sort') || 'popular'

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState(initialSort)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://dummyjson.com/products?limit=100')
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

  // Toggle wishlist - FIXED: Only one toast with a flag to prevent duplicate
  const toggleWishlist = useCallback((productId, e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    
    // Use a ref to track if toast was already shown
    let toastShown = false
    
    setWishlist(prev => {
      const exists = prev.includes(productId)
      const newWishlist = exists 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      
      localStorage.setItem('omega_wishlist', JSON.stringify(newWishlist))
      
      // Only show toast if not already shown
      if (!toastShown) {
        toastShown = true
        toast.success(exists ? 'Removed from wishlist' : '❤️ Added to wishlist!')
      }
      
      return newWishlist
    })
  }, [])

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const searchFromURL = params.get('search') || ''
    const categoryFromURL = params.get('category') || ''
    const sortFromURL = params.get('sort') || 'popular'
    
    if (searchFromURL !== search) {
      setSearch(searchFromURL)
    }
    if (categoryFromURL !== category) {
      setCategory(categoryFromURL)
    }
    if (sortFromURL !== sortBy) {
      setSortBy(sortFromURL)
    }
  }, [searchParams])

  // Filter and sort products
  const filtered = useMemo(() => {
    let result = [...products]
    
    if (!isAdmin) {
      result = result.filter(p => p.published !== false)
    }
    
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    }
    
    if (category) {
      const selectedCategories = category.split(',').filter(Boolean)
      result = result.filter(p => selectedCategories.includes(p.category))
    }
    
    switch(sortBy) {
      case 'popular':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating)
        break
      default:
        break
    }
    
    return result
  }, [products, search, category, sortBy, isAdmin])

  // Update URL when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (sortBy && sortBy !== 'popular') params.set('sort', sortBy)
      if (currentPage > 1) params.set('page', currentPage)
      
      const currentParams = new URLSearchParams(window.location.search)
      const currentSearch = currentParams.get('search') || ''
      const currentCategory = currentParams.get('category') || ''
      const currentSort = currentParams.get('sort') || 'popular'
      
      if (search !== currentSearch || category !== currentCategory || sortBy !== currentSort) {
        setSearchParams(params, { replace: true })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, category, sortBy, currentPage, setSearchParams])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const categories = [...new Set(products.map(p => p.category))]

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
        {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400" size={12} />)}
        {half === 1 && <FaStarHalfAlt className="text-yellow-400" size={12} />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400" size={12} />)}
      </>
    )
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <span key={i} className="bg-yellow-200 px-0.5 rounded">{part}</span> 
        : part
    )
  }

  const clearAllFilters = useCallback(() => {
    setSearch('')
    setCategory('')
    setSortBy('popular')
    setCurrentPage(1)
    navigate('/products')
  }, [navigate])

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
      <div className="w-full px-2 sm:px-4 md:px-6">
        <Breadcrumb />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />

      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Total Products</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              <CountUp end={stats.total} duration={1.5} />
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Avg Rating</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              <CountUp end={stats.avgRating} duration={1.5} decimals={1} />
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 col-span-2 md:col-span-1">
            <div className="text-xs sm:text-sm text-gray-500">Inventory Value</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              ₹<CountUp end={stats.totalValue * 83} duration={1.5} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-1.5 sm:p-2 rounded-xl">
              <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {filtered.length} products available
            {category && <span className="text-purple-600 font-medium"> in selected categories</span>}
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-8 sm:pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 sm:flex-none min-w-[120px] sm:min-w-[160px]">
              <MultiCategoryFilter
                categories={categories}
                selectedCategories={category.split(',').filter(Boolean)}
                onChange={(selected) => {
                  setCategory(selected.join(','))
                  setCurrentPage(1)
                }}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[80px] sm:min-w-[140px]"
            >
              <option value="popular">Popular</option>
              <option value="title-asc">Name: A to Z</option>
              <option value="title-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
            
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>
        
        {category && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
            {category.split(',').filter(Boolean).map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
              >
                {cat}
                <button
                  onClick={() => {
                    const newCategories = category.split(',').filter(c => c !== cat).join(',')
                    setCategory(newCategories)
                    setCurrentPage(1)
                  }}
                  className="hover:text-purple-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {paginatedProducts.length === 0 ? (
        <EmptyState 
          icon="🔍"
          title="No products match your filters"
          description="Try clearing filters or searching for another product"
          actionText="Clear Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative bg-white p-2 sm:p-4 h-32 sm:h-40 md:h-48 flex items-center justify-center">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Wishlist Button - FIXED */}
                  <button 
                    className={`absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md transition-all ${
                      wishlist.includes(product.id) 
                        ? 'opacity-100 scale-110' 
                        : 'opacity-0 group-hover:opacity-100'
                    } hover:bg-red-50`}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      toggleWishlist(product.id)
                    }}
                  >
                    <FaHeart className={`w-3 h-3 sm:w-4 sm:h-4 transition ${
                      wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`} />
                  </button>
                  
                  {product.stock > 0 ? (
                    <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 px-1.5 py-0.5 sm:px-2 bg-green-100 text-green-700 text-[8px] sm:text-xs rounded-full font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 px-1.5 py-0.5 sm:px-2 bg-red-100 text-red-700 text-[8px] sm:text-xs rounded-full font-medium">
                      Out of Stock
                    </span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={(e) => togglePublish(product.id, e)}
                      className={`absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 text-[8px] sm:text-xs rounded-full transition ${
                        product.published 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.published ? 'Published' : 'Hidden'}
                    </button>
                  )}
                </div>

                <div className="p-1.5 sm:p-3">
                  <h3 className="font-medium text-gray-900 text-[10px] sm:text-sm line-clamp-2 h-6 sm:h-10">
                    {highlightText(product.title, search)}
                  </h3>
                  
                  <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-[8px] sm:text-xs text-gray-500 ml-0.5">({product.rating})</span>
                  </div>
                  
                  <div className="mt-0.5 sm:mt-2">
                    <span className="text-xs sm:text-lg font-bold text-gray-900">₹{Math.round(product.price * 83)}</span>
                    <span className="text-[8px] sm:text-xs text-gray-400 line-through ml-1 sm:ml-2">
                      ₹{Math.round(product.price * 83 * 1.4)}
                    </span>
                    <span className="text-[8px] sm:text-xs text-green-600 ml-0.5 sm:ml-2">40% off</span>
                  </div>
                  
                  <div className="mt-0.5 sm:mt-1">
                    <span className="text-[8px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {product.stock > 0 && (
                    <div className="mt-0.5 sm:mt-2 text-[8px] sm:text-xs text-green-600 font-medium">
                      Free Delivery
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] sm:text-sm text-gray-500 order-2 sm:order-1">
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </div>
              <div className="flex gap-0.5 sm:gap-1 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                
                {(() => {
                  const pages = []
                  const maxVisible = window.innerWidth < 640 ? 3 : 5
                  if (totalPages <= maxVisible) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                  } else if (currentPage <= 2) {
                    for (let i = 1; i <= 3; i++) pages.push(i)
                    pages.push('...')
                    pages.push(totalPages)
                  } else if (currentPage >= totalPages - 1) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i)
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
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm transition ${
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
                  className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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