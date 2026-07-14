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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-gray-100">
        {/* Logo - Amazon/Flipkart style */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-purple-200">
            Ω
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Omega</h1>
          <p className="text-gray-500 text-sm">Choose your experience</p>
        </div>

        {/* Role Selection - Flipkart/Amazon style */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setRole('user')}
            className={`p-6 rounded-xl border-2 transition-all ${
              role === 'user'
                ? 'border-purple-600 bg-purple-50 shadow-md scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 ${
                role === 'user' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaUser />
              </div>
              <div className={`font-semibold ${role === 'user' ? 'text-purple-700' : 'text-gray-700'}`}>
                Customer
              </div>
              <div className="text-xs text-gray-500 mt-1">Shop & Orders</div>
            </div>
          </button>
          
          <button
            onClick={() => setRole('admin')}
            className={`p-6 rounded-xl border-2 transition-all ${
              role === 'admin'
                ? 'border-purple-600 bg-purple-50 shadow-md scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 ${
                role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaCrown />
              </div>
              <div className={`font-semibold ${role === 'admin' ? 'text-purple-700' : 'text-gray-700'}`}>
                Admin
              </div>
              <div className="text-xs text-gray-500 mt-1">Full Access</div>
            </div>
          </button>
        </div>

        {/* Features preview - Amazon style */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <FaShoppingBag className="text-purple-500 text-lg" />
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

        {/* Login Button - Amazon/Flipkart style */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          Continue as {role === 'admin' ? 'Admin' : 'Customer'}
          <FaArrowRight className="text-sm" />
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our Terms of Service
        </p>

        {/* Trust badges - Amazon style */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
          <span>🔒 Secure</span>
          <span>⚡ Fast</span>
          <span>🛡️ Trusted</span>
        </div>
      </div>
    </div>
  )
}

export default Login