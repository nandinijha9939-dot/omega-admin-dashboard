import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaArrowRight, FaCrown, FaUser, FaShoppingBag } from 'react-icons/fa'

const Login = () => {
  const [role, setRole] = useState('user')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    login(role)
    navigate('/products')
  }

  // Random subtle decorative elements
  const decorativeDots = Array.from({ length: 20 }, (_, i) => (
    <div 
      key={i}
      className="absolute rounded-full opacity-10"
      style={{
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        background: ['#8b5cf6', '#6d28d9', '#a78bfa', '#c4b5fd'][Math.floor(Math.random() * 4)],
        animationDelay: Math.random() * 3 + 's',
        animationDuration: Math.random() * 3 + 2 + 's',
      }}
    />
  ))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/60 p-4 relative overflow-hidden">
      {/* Decorative dots */}
      {decorativeDots}
      
      <div className="login-card relative z-10">
        {/* Small decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-30"></div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-purple-200/50 relative">
            Ω
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 tracking-tight">Omega</h1>
          <p className="text-gray-500/80 text-sm">Choose your experience</p>
        </div>

        {/* Demo Credentials Badge */}
        <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-xs text-blue-700">
            <span className="font-semibold">🔑 Demo:</span>
            <span className="bg-blue-100/80 px-2 py-0.5 rounded">Admin: admin</span>
            <span className="bg-blue-100/80 px-2 py-0.5 rounded">User: user</span>
            <span className="text-blue-500/70 text-[10px]">(No password)</span>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setRole('user')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              role === 'user'
                ? 'border-purple-500/60 bg-purple-50/80 shadow-md shadow-purple-200/30 scale-[1.02]'
                : 'border-gray-200/60 hover:border-purple-300/40 hover:bg-gray-50/50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                role === 'user' ? 'bg-purple-100/80 text-purple-600' : 'bg-gray-100/80 text-gray-400'
              }`}>
                <FaUser />
              </div>
              <div className={`font-semibold ${role === 'user' ? 'text-purple-700' : 'text-gray-700'}`}>
                Customer
              </div>
              <div className="text-xs text-gray-500/70 mt-1">Shop & Orders</div>
            </div>
          </button>
          
          <button
            onClick={() => setRole('admin')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              role === 'admin'
                ? 'border-purple-500/60 bg-purple-50/80 shadow-md shadow-purple-200/30 scale-[1.02]'
                : 'border-gray-200/60 hover:border-purple-300/40 hover:bg-gray-50/50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                role === 'admin' ? 'bg-purple-100/80 text-purple-600' : 'bg-gray-100/80 text-gray-400'
              }`}>
                <FaCrown />
              </div>
              <div className={`font-semibold ${role === 'admin' ? 'text-purple-700' : 'text-gray-700'}`}>
                Admin
              </div>
              <div className="text-xs text-gray-500/70 mt-1">Full Access</div>
            </div>
          </button>
        </div>

        {/* Features preview */}
        <div className="bg-gray-50/80 rounded-xl p-4 mb-6 border border-gray-200/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <FaShoppingBag className="text-purple-500/80 text-lg" />
            <div>
              <span className="font-medium text-gray-700">You'll get:</span>
              <span className="ml-1">
                {role === 'user' ? (
                  'Product browsing, orders, categories'
                ) : (
                  'Full control, analytics, customer management'
                )}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-200/50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] group"
        >
          Continue as {role === 'admin' ? 'Admin' : 'Customer'}
          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-gray-400/70 mt-4 tracking-wide">
          By continuing, you agree to our Terms of Service
        </p>

        {/* Trust badges */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400/60">
          <span className="flex items-center gap-1">🔒 Secure</span>
          <span className="flex items-center gap-1">⚡ Fast</span>
          <span className="flex items-center gap-1">🛡️ Trusted</span>
        </div>
      </div>
    </div>
  )
}

export default Login