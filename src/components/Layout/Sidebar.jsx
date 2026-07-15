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
  FaUser,
  FaTimes
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const userItems = [
    { to: '/products', icon: FaStore, label: 'Shop' },
    { to: '/categories', icon: FaTags, label: 'Categories' },
    { to: '/my-orders', icon: FaClipboardList, label: 'My Orders' },
    { to: '/profile', icon: FaUser, label: 'My Profile' },
  ]

  const adminItems = [
    { to: '/products', icon: FaStore, label: 'Products' },
    { to: '/categories', icon: FaTags, label: 'Categories' },
    { to: '/analytics', icon: FaChartPie, label: 'Analytics' },
    { to: '/customers', icon: FaUsers, label: 'Customers' },
    { to: '/orders', icon: FaShoppingCart, label: 'All Orders' },
  ]

  const items = isAdmin ? adminItems : userItems

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-72 h-full bg-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col overflow-y-auto
        border-r border-gray-100
        shadow-2xl shadow-gray-200/30
      `}>
        {/* Close button on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 md:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              Ω
            </div>
            <span className="font-bold text-gray-900">Omega</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Logo - Desktop */}
        <div className="hidden md:flex p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 flex-shrink-0 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200/40">
            Ω
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Omega<span className="text-purple-600">.</span></h2>
            <p className="text-xs text-gray-500/70">{isAdmin ? 'Admin Panel' : 'Customer Portal'}</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border border-purple-100/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200/30 flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-purple-100/80 text-purple-700' : 'bg-blue-100/80 text-blue-700'
                }`}>
                  {isAdmin ? '👑 Admin' : '🛒 Customer'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
              title="Logout"
            >
              <FaSignOutAlt className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400/70 uppercase tracking-widest px-3 mb-4">
            {isAdmin ? 'Dashboard' : 'Browse'}
          </div>
          
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-purple-50/60 text-purple-700 font-medium shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50/60 hover:text-gray-900'
                  }`
                }
                onClick={() => {
                  setIsOpen(false)
                }}
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
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-400/60">© 2024 Omega</p>
            <p className="text-[10px] text-gray-400/40 mt-1 tracking-widest">✦ v2.0.0 ✦</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar