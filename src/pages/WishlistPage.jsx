import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Breadcrumb from '../components/Common/Breadcrumb'
import EmptyState from '../components/Common/EmptyState'
import LoadingSpinner from '../components/Common/LoadingSpinner'

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState([])
  const navigate = useNavigate()

  // Fetch all products and filter wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true)
        
        // Get wishlist IDs from localStorage
        const saved = localStorage.getItem('omega_wishlist')
        const wishlistIds = saved ? JSON.parse(saved) : []
        
        if (wishlistIds.length === 0) {
          setWishlistProducts([])
          setLoading(false)
          return
        }

        // Fetch all products to get full details
        const response = await axios.get('https://dummyjson.com/products?limit=100')
        const allProductsData = response.data.products
        
        // Filter only products that are in wishlist
        const wishlistItems = allProductsData.filter(p => wishlistIds.includes(p.id))
        setWishlistProducts(wishlistItems)
        setAllProducts(allProductsData)
      } catch (error) {
        console.error('Failed to fetch wishlist:', error)
        toast.error('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }
    
    fetchWishlist()
  }, [])

  // Remove from wishlist
  const removeFromWishlist = (productId, e) => {
    e.stopPropagation()
    
    // Update localStorage
    const saved = localStorage.getItem('omega_wishlist')
    const wishlistIds = saved ? JSON.parse(saved) : []
    const newWishlist = wishlistIds.filter(id => id !== productId)
    localStorage.setItem('omega_wishlist', JSON.stringify(newWishlist))
    
    // Update UI
    setWishlistProducts(prev => prev.filter(p => p.id !== productId))
    toast.success('Removed from wishlist')
  }

  // Render stars
  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5 ? 1 : 0
    const empty = 5 - full - half
    return (
      <>
        {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />)}
        {half === 1 && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />)}
      </>
    )
  }

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <Breadcrumb />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-2 rounded-xl">
              <FaHeart className="w-5 h-5" />
            </span>
            Wishlist
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Remove all items from wishlist?')) {
                localStorage.setItem('omega_wishlist', JSON.stringify([]))
                setWishlistProducts([])
                toast.success('Wishlist cleared')
              }
            }}
            className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1"
          >
            <FaTrash className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState 
          icon="❤️"
          title="No products in your wishlist yet"
          description="Start adding products you love to your wishlist"
          actionText="Browse Products"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {wishlistProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative bg-white p-3 sm:p-4 h-32 sm:h-40 md:h-48 flex items-center justify-center">
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Remove from wishlist button */}
                <button 
                  onClick={(e) => removeFromWishlist(product.id, e)}
                  className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-current" />
                </button>
                
                {product.stock > 0 ? (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 sm:px-2 bg-green-100 text-green-700 text-[8px] sm:text-xs rounded-full font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 sm:px-2 bg-red-100 text-red-700 text-[8px] sm:text-xs rounded-full font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-medium text-gray-900 text-[10px] sm:text-sm line-clamp-2 h-6 sm:h-10">
                  {product.title}
                </h3>
                <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                  {renderStars(product.rating)}
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
      )}
    </div>
  )
}

export default WishlistPage