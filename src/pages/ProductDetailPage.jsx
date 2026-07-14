import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaCheck } from 'react-icons/fa'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${id}`)
      .then(res => { 
        setProduct(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5 ? 1 : 0
    const empty = 5 - full - half
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400 text-lg" />)}
        {half === 1 && <FaStarHalfAlt className="text-yellow-400 text-lg" />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-lg" />)}
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

  if (!product) {
    return <div className="text-center py-20">Product not found</div>
  }

  const images = [product.thumbnail, ...(product.images || [])].slice(0, 5)
  const inStock = product.stock > 0
  const discount = Math.round((1 - product.price / (product.price * 1.4)) * 100)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb - Amazon style */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/products')}>
          Home
        </span>
        <span className="mx-2">›</span>
        <span className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/products')}>
          Products
        </span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.category}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left - Images - Amazon style */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-50 rounded-xl p-4 h-96 flex items-center justify-center border border-gray-200">
              <img 
                src={images[selectedImage]} 
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`w-20 h-20 border-2 rounded-lg p-1 cursor-pointer transition ${
                    selectedImage === idx ? 'border-purple-600' : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Info - Amazon/Flipkart style */}
          <div>
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            
            {/* Rating - Amazon style */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">{product.rating} out of 5</span>
              <span className="text-sm text-blue-600">{Math.floor(Math.random() * 500) + 100} ratings</span>
            </div>

            {/* Price - Flipkart style */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{Math.round(product.price * 83)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{Math.round(product.price * 83 * 1.4)}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {discount}% off
                </span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                {inStock ? 'In Stock' : 'Out of Stock'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </div>
            </div>

            {/* Description - Amazon style */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-1">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details - Flipkart style */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
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

            {/* Actions - Amazon style */}
            <div className="mt-6 flex gap-3">
              <button 
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                  inStock 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!inStock}
              >
                <FaShoppingCart className="w-5 h-5" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition shadow-lg shadow-purple-200">
                Buy Now
              </button>
              
              <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <FaHeart className="w-5 h-5 text-gray-400 hover:text-red-500 transition" />
              </button>
            </div>

            {/* Delivery info - Amazon style */}
            {inStock && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <FaCheck className="text-green-600" />
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