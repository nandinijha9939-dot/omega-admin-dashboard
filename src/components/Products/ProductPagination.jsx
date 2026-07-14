import React, { memo, useMemo } from 'react'

const ProductPagination = memo(({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange 
}) => {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisible = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages])

  if (totalItems === 0) return null

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{start}</span> - 
        <span className="font-semibold text-gray-900"> {end}</span> of 
        <span className="font-semibold text-gray-900"> {totalItems}</span> products
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              page === currentPage
                ? 'bg-purple-600 text-white'
                : typeof page === 'number'
                ? 'border border-gray-300 hover:bg-gray-50'
                : 'cursor-default text-gray-400'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
})

ProductPagination.displayName = 'ProductPagination'

export default ProductPagination