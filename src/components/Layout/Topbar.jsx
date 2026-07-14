import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const notificationRef = useRef(null)
  const buttonRef = useRef(null)

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/products') return 'Products'
    if (path === '/analytics') return 'Analytics'
    if (path === '/categories') return 'Categories'
    if (path === '/customers') return 'Customers'
    if (path === '/orders') return 'Orders'
    if (path === '/my-orders') return 'My Orders'
    if (path === '/profile') return 'My Profile'
    if (path.startsWith('/products/')) return 'Product Details'
    return 'Dashboard'
  }

  const handleSearch = useCallback((e) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`)
    } else {
      navigate('/products')
    }
  }, [navigate])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchQuery = params.get('search')
    if (searchQuery) {
      setSearch(searchQuery)
    } else {
      setSearch('')
    }
  }, [location.search])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]')
        if (searchInput) searchInput.focus()
      }
      if (e.key === 'Escape' && showNotifications) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showNotifications])

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleUserClick = () => {
    navigate('/profile')
  }

  const getNotifications = () => {
    if (isAdmin) {
      return [
        {
          id: 1,
          title: 'New order received',
          description: 'Order #ORD-0042 from John Doe',
          time: '2 min ago',
          color: 'bg-green-500'
        },
        {
          id: 2,
          title: 'Product review',
          description: 'New 5-star review on "iPhone 13"',
          time: '15 min ago',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          title: 'Low stock alert',
          description: '"Smart Watch" only 3 left in stock',
          time: '1 hour ago',
          color: 'bg-yellow-500'
        }
      ]
    } else {
      return [
        {
          id: 1,
          title: 'Your order is out for delivery!',
          description: 'Order #ORD-0023 will arrive today',
          time: '1 hour ago',
          color: 'bg-green-500'
        },
        {
          id: 2,
          title: 'Price drop alert!',
          description: 'iPhone 15 Pro is now ₹89,999',
          time: '3 hours ago',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          title: 'New product recommendation',
          description: 'Check out the new Samsung Galaxy S24',
          time: '5 hours ago',
          color: 'bg-purple-500'
        }
      ]
    }
  }

  const notifications = getNotifications()
  const unreadCount = notifications.length

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between sticky top-0 z-30 w-full">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile menu button - only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <FaBars className="w-5 h-5" />
        </button>
        
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block truncate">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Search - Desktop */}
        <div className="relative hidden md:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            value={search}
            onChange={handleSearch}
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-32 lg:w-48 xl:w-64 transition-all"
          />
        </div>

        {/* Search - Mobile */}
        <button 
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Notification */}
        <button 
          ref={buttonRef}
          onClick={handleNotificationClick}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <FaBell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {/* User Profile */}
        <div 
          onClick={handleUserClick}
          className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg px-2 sm:px-3 py-1 border border-gray-200 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold group-hover:scale-105 transition">
            {user?.name?.[0] || 'U'}
          </div>
          <span className="text-xs sm:text-sm font-medium hidden sm:block group-hover:text-purple-600 transition truncate max-w-[60px]">
            {user?.name}
          </span>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-3 z-40 md:hidden shadow-lg">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Notification Dropdown */}
      {showNotifications && (
        <div 
          ref={notificationRef}
          className="absolute right-2 sm:right-4 top-14 sm:top-16 mt-2 w-[calc(100vw-16px)] sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in max-h-[80vh]"
        >
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {isAdmin ? 'Admin Notifications' : 'Notifications'}
            </h3>
            <span className="text-xs text-purple-600 font-medium">
              {unreadCount} new
            </span>
          </div>
          
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group"
              >
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 ${notif.color} rounded-full flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-purple-600 transition truncate">
                    {notif.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">{notif.description}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-2 sm:p-3 border-t border-gray-200 text-center">
            <button className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium">
              {isAdmin ? 'View all notifications' : 'See all updates'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Topbar