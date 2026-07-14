import React, { memo } from 'react'

const ProductRow = memo(({ product, index, isAdmin, onRowClick, onTogglePublish }) => {
  const getStockStatus = (stock) => {
    if (stock > 20) return { label: 'In Stock', className: 'in-stock' }
    if (stock > 0) return { label: 'Low Stock', className: 'low-stock' }
    return { label: 'Out of Stock', className: 'out-of-stock' }
  }

  const stockInfo = getStockStatus(product.stock)
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))

  return (
    <tr className="hover:bg-purple-50/30 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
      <td>
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onRowClick(product.id)}
        >
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
          <span className="font-medium text-gray-900 hover:text-purple-600 transition-colors">
            {product.title}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
          {product.category}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-semibold text-gray-900">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`status-badge ${stockInfo.className}`}>
          {stockInfo.label}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-yellow-500 text-sm">
          {stars}
        </span>
      </td>
      {isAdmin && (
        <>
          <td className="px-4 py-3 text-center">
            <span className={`status-badge ${product.published ? 'published' : 'hidden'}`}>
              {product.published ? 'Published' : 'Hidden'}
            </span>
          </td>
          <td className="px-4 py-3 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTogglePublish(product.id)
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                product.published
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {product.published ? 'Hide' : 'Publish'}
            </button>
          </td>
        </>
      )}
    </tr>
  )
})

ProductRow.displayName = 'ProductRow'

export default ProductRow