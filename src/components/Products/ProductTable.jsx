import React, { memo } from 'react'
import ProductRow from './ProductRow'

const ProductTable = memo(({ products, isAdmin, onRowClick, onTogglePublish }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
            {isAdmin && (
              <>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              isAdmin={isAdmin}
              onRowClick={onRowClick}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
})

ProductTable.displayName = 'ProductTable'

export default ProductTable