import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FaChartPie,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaClipboardList,
  FaStore,
  FaUser,
  FaTimes,
  FaHeart
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const userItems = [
    { to: '/products', icon: FaStore, label: 'Shop' },
    { to: '/categories', icon: FaTags, label: 'Categories' },
    { to: '/wishlist', icon: FaHeart, label: 'Wishlist' },
    { to: '/my-orders', icon: FaClipboardList, label: 'My Orders' },
    { to: '/profile', icon: FaUser, label: 'My Profile' }
  ]

  const adminItems = [
    { to: '/products', icon: FaStore, label: 'Products' },
    { to: '/categories', icon: FaTags, label: 'Categories' },
    { to: '/analytics', icon: FaChartPie, label: 'Analytics' },
    { to: '/customers', icon: FaUsers, label: 'Customers' },
    { to: '/orders', icon: FaShoppingCart, label: 'All Orders' }
  ]

  const items = isAdmin ? adminItems : userItems

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex h-full w-72 flex-col
          bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-lg">
              Ω
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Omega
              </h2>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Admin Dashboard' : 'Customer Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* User */}
        <div className="mx-4 mt-5 p-3 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'User'}
              </p>

              <span
                className={`
                  inline-block mt-1 px-2 py-0.5
                  text-xs font-medium rounded-md
                  ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                `}
              >
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <FaSignOutAlt className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {isAdmin ? 'Dashboard' : 'Menu'}
          </p>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-3 py-2.5 rounded-lg
                    text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive
                            ? 'text-purple-600'
                            : 'text-gray-400'
                        }`}
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              © 2026 Omega
            </p>

            <span className="text-xs text-gray-400">
              {isAdmin ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar