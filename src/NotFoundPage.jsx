import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
        <p className="text-gray-500 mt-2">The page you're looking for doesn't exist</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage