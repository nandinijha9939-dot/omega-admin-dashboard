import React from 'react'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEnvelope, FaCalendar, FaShoppingBag, FaStar, FaCrown, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const UserProfilePage = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Mock user data
  const userData = {
    name: user?.name || 'User',
    email: user?.role === 'admin' ? 'admin@omega.com' : 'user@omega.com',
    joined: 'January 2024',
    totalOrders: isAdmin ? 0 : Math.floor(Math.random() * 15) + 3,
    totalSpent: isAdmin ? 0 : Math.floor(Math.random() * 50000) + 10000,
    wishlist: isAdmin ? 0 : Math.floor(Math.random() * 10) + 2,
    rating: isAdmin ? 0 : (Math.random() * 2 + 3).toFixed(1),
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header - Flipkart/Amazon style */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {isAdmin ? '👑 Admin' : '🛒 Customer'}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {isAdmin ? 'Full Access' : 'Standard User'}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
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
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2 text-sm"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Cards - Amazon style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-xl font-bold text-gray-900">{userData.totalOrders}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaStar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Rating</div>
              <div className="text-xl font-bold text-gray-900">{userData.rating || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <FaShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Wishlist</div>
              <div className="text-xl font-bold text-gray-900">{userData.wishlist} items</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaCrown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Spent</div>
              <div className="text-xl font-bold text-gray-900">₹{userData.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Flipkart style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/my-orders')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition">📦</div>
          <div className="font-medium text-gray-900">My Orders</div>
          <div className="text-sm text-gray-500">View order history</div>
        </button>
        
        <button 
          onClick={() => navigate('/products')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition">🛍️</div>
          <div className="font-medium text-gray-900">Continue Shopping</div>
          <div className="text-sm text-gray-500">Browse products</div>
        </button>
        
        <button 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition">❤️</div>
          <div className="font-medium text-gray-900">Wishlist</div>
          <div className="text-sm text-gray-500">{userData.wishlist} saved items</div>
        </button>
        
        <button 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition">⚙️</div>
          <div className="font-medium text-gray-900">Settings</div>
          <div className="text-sm text-gray-500">Account preferences</div>
        </button>
      </div>

      {/* Admin Quick Access */}
      {isAdmin && (
        <div className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-3">👑 Admin Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button 
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              📊 Analytics
            </button>
            <button 
              onClick={() => navigate('/customers')}
              className="px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              👥 Customers
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-100 transition text-sm text-center"
            >
              📦 All Orders
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity - Amazon style */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Last logged in today at 10:30 AM</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Viewed "iPhone 15 Pro" product</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
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