import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaBell, FaSearch } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Topbar = ({ onMenuClick }) => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/products') return 'Products'
    if (path === '/analytics') return 'Analytics'
    if (path === '/categories') return 'Categories'
    if (path === '/customers') return 'Customers'
    if (path === '/orders') return 'Orders'
    if (path === '/my-orders') return 'My Orders'
    if (path.startsWith('/products/')) return 'Product Details'
    return 'Dashboard'
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`)
    } else {
      navigate('/products')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchQuery = params.get('search')
    if (searchQuery) {
      setSearch(searchQuery)
    }
  }, [location.search])

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!isAdmin) {
      toast.success('You have new product recommendations!')
    } else {
      toast.success('You have 3 new notifications!')
    }
  }

  // Different notifications for Admin vs User
  const getNotifications = () => {
    if (isAdmin) {
      // Admin notifications - business/management related
      return [
        {
          id: 1,
          title: 'New order received',
          description: 'Order #ORD-0042 from John Doe',
          time: '2 min ago',
          type: 'admin',
          color: 'bg-green-500'
        },
        {
          id: 2,
          title: 'Product review',
          description: 'New 5-star review on "iPhone 13"',
          time: '15 min ago',
          type: 'admin',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          title: 'Low stock alert',
          description: '"Smart Watch" only 3 left in stock',
          time: '1 hour ago',
          type: 'admin',
          color: 'bg-yellow-500'
        }
      ]
    } else {
      // User notifications - customer related
      return [
        {
          id: 1,
          title: 'Your order is out for delivery!',
          description: 'Order #ORD-0023 will arrive today',
          time: '1 hour ago',
          type: 'user',
          color: 'bg-green-500'
        },
        {
          id: 2,
          title: 'Price drop alert!',
          description: 'iPhone 15 Pro is now ₹89,999',
          time: '3 hours ago',
          type: 'user',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          title: 'New product recommendation',
          description: 'Check out the new Samsung Galaxy S24',
          time: '5 hours ago',
          type: 'user',
          color: 'bg-purple-500'
        },
        {
          id: 4,
          title: 'Flash sale starting soon!',
          description: 'Up to 70% off on electronics',
          time: '1 day ago',
          type: 'user',
          color: 'bg-orange-500'
        }
      ]
    }
  }

  const notifications = getNotifications()
  const unreadCount = notifications.length

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaBars className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Notification Button */}
        <button 
          onClick={handleNotificationClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <FaBell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0] || 'U'}
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.name}</span>
          <span className="text-xs text-gray-400 hidden lg:block">
            {isAdmin ? '(Admin)' : ''}
          </span>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-16 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {isAdmin ? 'Admin Notifications' : 'Notifications'}
            </h3>
            <span className="text-xs text-purple-600 font-medium">
              {unreadCount} new
            </span>
          </div>
          
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group"
              >
                <div className={`w-2 h-2 mt-2 ${notif.color} rounded-full flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500">{notif.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                {isAdmin && (
                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium opacity-0 group-hover:opacity-100 transition">
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              {isAdmin ? 'View all notifications' : 'See all updates'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Topbar