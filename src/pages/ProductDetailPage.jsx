import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaArrowLeft, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Breadcrumb from '../components/Common/Breadcrumb'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('omega_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        const data = { ...response.data, published: true }
        
        // Check if user can view this product
        if (!isAdmin && !data.published) {
          toast.error('This product is not available')
          navigate('/products')
          return
        }
        
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        toast.error('Failed to load product')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, isAdmin, navigate])

  // Toggle wishlist - FIXED: Only one toast message
  const toggleWishlist = () => {
    if (!product) return
    
    setWishlist(prev => {
      const exists = prev.includes(product.id)
      const newWishlist = exists 
        ? prev.filter(pid => pid !== product.id)
        : [...prev, product.id]
      
      localStorage.setItem('omega_wishlist', JSON.stringify(newWishlist))
      
      // Single toast message - FIXED
      toast.success(exists ? 'Removed from wishlist' : '❤️ Added to wishlist!')
      
      return newWishlist
    })
  }

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

  if (loading) return <LoadingSpinner />
  if (!product) return null

  const images = [product.thumbnail, ...(product.images || [])].slice(0, 5)
  const inStock = product.stock > 0
  const discount = Math.round((1 - product.price / (product.price * 1.4)) * 100)

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />
      
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4 text-sm sm:text-base"
      >
        <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-50 rounded-xl p-2 sm:p-4 h-64 sm:h-80 md:h-96 flex items-center justify-center border border-gray-200">
              <img 
                src={images[selectedImage]} 
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`w-14 h-14 sm:w-20 sm:h-20 border-2 rounded-lg p-1 cursor-pointer transition flex-shrink-0 ${
                    selectedImage === idx ? 'border-purple-600' : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">{product.rating} out of 5</span>
              <span className="text-sm text-blue-600">{Math.floor(Math.random() * 500) + 100} ratings</span>
            </div>

            {/* Price */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{Math.round(product.price * 83)}
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ₹{Math.round(product.price * 83 * 1.4)}
                </span>
                <span className="text-base sm:text-lg font-semibold text-green-600">
                  {discount}% off
                </span>
              </div>
              <div className={`text-sm mt-1 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Category</span>
                <div className="font-medium text-gray-900">{product.category}</div>
              </div>
              <div>
                <span className="text-gray-500">Brand</span>
                <div className="font-medium text-gray-900">{product.brand || 'Generic'}</div>
              </div>
              <div>
                <span className="text-gray-500">Stock</span>
                <div className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? `${product.stock} units` : 'Out of Stock'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">SKU</span>
                <div className="font-medium text-gray-900">{product.sku || 'N/A'}</div>
              </div>
            </div>

            {/* Actions - Only Wishlist */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
              <button 
                onClick={toggleWishlist}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition ${
                  wishlist.includes(product.id)
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                }`}
              >
                <FaHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                {wishlist.includes(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Delivery info */}
            {inStock && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <FaCheck className="text-green-600 text-lg" />
                  <span className="text-gray-600">
                    Free delivery by <span className="font-medium text-gray-900">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage