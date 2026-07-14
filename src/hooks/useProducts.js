import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from './useDebounce'

const API_BASE = 'https://dummyjson.com/products'

export const useProducts = (initialFilters = {}) => {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters state
  const [search, setSearch] = useState(initialFilters.search || '')
  const [category, setCategory] = useState(initialFilters.category || '')
  const [rating, setRating] = useState(initialFilters.rating || 0)
  const [sort, setSort] = useState(initialFilters.sort || '-rating')
  const [page, setPage] = useState(initialFilters.page || 1)
  
  const debouncedSearch = useDebounce(search, 300)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE}?limit=100`)
        let data = response.data.products.map(p => ({
          ...p,
          published: true, // Default all published
        }))
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter and sort products - using useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category)
    }

    // Filter by rating
    if (rating > 0) {
      result = result.filter(p => p.rating >= rating)
    }

    // User view: only published
    if (!isAdmin) {
      result = result.filter(p => p.published === true)
    }

    // Sort
    const sortKey = sort.startsWith('-') ? sort.substring(1) : sort
    const descending = sort.startsWith('-')
    result.sort((a, b) => {
      let valA = a[sortKey] ?? 0
      let valB = b[sortKey] ?? 0
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return descending ? 1 : -1
      if (valA > valB) return descending ? -1 : 1
      return 0
    })

    return result
  }, [products, debouncedSearch, category, rating, sort, isAdmin])

  // Pagination
  const pageSize = 10
  const totalPages = Math.ceil(filteredProducts.length / pageSize)
  
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.slice(start, end)
  }, [filteredProducts, page, pageSize])

  // Toggle publish status (admin only)
  const togglePublish = useCallback((productId) => {
    if (!isAdmin) return
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, published: !p.published }
          : p
      )
    )
  }, [isAdmin])

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearch('')
    setCategory('')
    setRating(0)
    setSort('-rating')
    setPage(1)
  }, [])

  return {
    products,
    loading,
    error,
    filteredProducts: paginatedProducts,
    totalProducts: filteredProducts.length,
    totalPages,
    currentPage: page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    rating,
    setRating,
    sort,
    setSort,
    togglePublish,
    resetFilters,
    isAdmin,
  }
}