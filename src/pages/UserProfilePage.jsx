import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaShoppingBag, 
  FaStar, 
  FaCrown, 
  FaSignOutAlt,
  FaHeart,
  FaTags,
  FaStore
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Common/Breadcrumb'

const UserProfilePage = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [wishlistCount, setWishlistCount] = useState(0)

  // Get wishlist count from localStorage
  useEffect(() => {
    const getWishlistCount = () => {
      try {
        const saved = localStorage.getItem('omega_wishlist')
        return saved ? JSON.parse(saved).length : 0
      } catch {
        return 0
      }
    }
    setWishlistCount(getWishlistCount())

    // Listen for storage changes (if wishlist updated in another tab)
    const handleStorageChange = () => {
      setWishlistCount(getWishlistCount())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userData = {
    name: user?.name || 'User',
    email: user?.role === 'admin' ? 'admin@omega.com' : 'user@omega.com',
    joined: 'January 2024',
    totalOrders: isAdmin ? 0 : Math.floor(Math.random() * 15) + 3,
    totalSpent: isAdmin ? 0 : Math.floor(Math.random() * 50000) + 10000,
    wishlist: wishlistCount,
    rating: isAdmin ? 0 : (Math.random() * 2 + 3).toFixed(1),
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl font-bold border-4 border-white shadow-lg flex-shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">{userData.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {isAdmin ? 'Full Access' : 'Standard User'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <FaEnvelope className="w-4 h-4" />
                {userData.email}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendar className="w-4 h-4" />
                Joined {userData.joined}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Total Orders</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">{userData.totalOrders}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaStar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Rating</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">{userData.rating || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <FaHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Wishlist</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">{userData.wishlist} items</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaCrown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Total Spent</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">₹{userData.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - All functional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button 
          onClick={() => navigate('/my-orders')}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition">📦</div>
          <div className="font-medium text-gray-900 text-sm sm:text-base">My Orders</div>
          <div className="text-xs text-gray-500">View order history</div>
        </button>
        
        <button 
          onClick={() => navigate('/products')}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition">🛍️</div>
          <div className="font-medium text-gray-900 text-sm sm:text-base">Continue Shopping</div>
          <div className="text-xs text-gray-500">Browse products</div>
        </button>
        
        <button 
          onClick={() => navigate('/wishlist')}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition">❤️</div>
          <div className="font-medium text-gray-900 text-sm sm:text-base">Wishlist</div>
          <div className="text-xs text-gray-500">{userData.wishlist} saved items</div>
        </button>
        
        <button 
          onClick={() => navigate('/categories')}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition">🏷️</div>
          <div className="font-medium text-gray-900 text-sm sm:text-base">Categories</div>
          <div className="text-xs text-gray-500">Browse by category</div>
        </button>
      </div>

      {/* Admin Quick Access */}
      {isAdmin && (
        <div className="mt-6 p-4 sm:p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Admin Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/analytics')}
              className="px-3 sm:px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              📊 Analytics
            </button>
            <button 
              onClick={() => navigate('/customers')}
              className="px-3 sm:px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              👥 Customers
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="px-3 sm:px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              📦 All Orders
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Recent Activity</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Last logged in today at 10:30 AM</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Viewed "iPhone 15 Pro" product</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Added "Samsung Galaxy S24" to wishlist</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage