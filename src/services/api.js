import axios from 'axios'

const API_BASE = 'https://dummyjson.com/products'

export const api = {
  getProducts: async (params = {}) => {
    const response = await axios.get(`${API_BASE}`, { params })
    return response.data
  },
  
  getProduct: async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`)
    return response.data
  },
  
  getCategories: async () => {
    const response = await axios.get(`${API_BASE}/categories`)
    return response.data
  },
}