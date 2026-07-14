import React, { memo, useState, useEffect } from 'react'
import axios from 'axios'

const ProductFilters = memo(({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  rating,
  onRatingChange,
  sort,
  onSortChange,
  onReset,
}) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug || cat} value={cat.slug || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[130px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
          <select
            value={rating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={0}>All</option>
            <option value={4}>4★ & up</option>
            <option value={3}>3★ & up</option>
            <option value={2}>2★ & up</option>
          </select>
        </div>

        <div className="w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="title">Name A-Z</option>
            <option value="-title">Name Z-A</option>
            <option value="price">Price: Low-High</option>
            <option value="-price">Price: High-Low</option>
            <option value="rating">Rating: Low-High</option>
            <option value="-rating">Rating: High-Low</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
})

ProductFilters.displayName = 'ProductFilters'

export default ProductFilters