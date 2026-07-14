import React from 'react'

const EmptyState = ({ 
  icon = '📦', 
  title = 'No products found', 
  description = 'Try adjusting your filters or search terms',
  actionText,
  onAction 
}) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState