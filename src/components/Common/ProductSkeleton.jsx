import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-32 sm:h-40 md:h-48"></div>
      <div className="p-1.5 sm:p-3 space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 sm:h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}

export default ProductSkeleton