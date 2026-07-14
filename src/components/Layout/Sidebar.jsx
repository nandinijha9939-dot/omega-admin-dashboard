// src/components/Layout/Sidebar.jsx - same as before but cleaner

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  FaBox, 
  FaChartPie, 
  FaTags, 
  FaUsers, 
  FaShoppingCart,
  FaSignOutAlt,
  FaClipboardList,
  FaStore,
  FaHome
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  // User items - Customer view
  const userItems = [
    { to: '/products', icon: FaStore, label: 'Shop' },
    { to: '/categories', icon: FaTags, label: 'Categories' },
    { to: '/my-orders', icon: FaClipboardList, label: 'My Orders' },
  ]

  // Admin items - Full management
  const adminItems = [
    { to: '/analytics', icon: FaChartPie, label: 'Analytics' },
    { to: '/customers', icon: FaUsers, label: 'Customers' },
    { to: '/orders', icon: FaShoppingCart, label: 'All Orders' },
  ]

  const items = isAdmin ? [...userItems, ...adminItems] : userItems

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex flex-col h-full
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              Ω
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Omega<span className="text-purple-600">.</span></h2>
              <p className="text-xs text-gray-500">{isAdmin ? 'Admin Panel' : 'Customer Portal'}</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{user?.name || 'User'}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isAdmin ? '👑 Admin' : '🛒 Customer'}
                </span>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            {isAdmin ? 'Management' : 'Browse'}
          </div>
          
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-medium shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-400">© 2024 Omega</p>
            <p className="text-xs text-gray-400 mt-1">v2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar