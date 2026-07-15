import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { 
  FaUsers, 
  FaSearch, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarker, 
  FaStar,
  FaShoppingBag,
  FaDollarSign,
  FaUserCheck,
  FaTimes
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Common/Breadcrumb'
import LoadingSpinner from '../components/Common/LoadingSpinner'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://dummyjson.com/users?limit=30')
        const users = response.data.users.map((user, index) => ({
          ...user,
          totalOrders: Math.floor(Math.random() * 25) + 2,
          totalSpent: (Math.random() * 5000 + 200).toFixed(2),
          rating: (Math.random() * 2 + 3).toFixed(1),
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: ['active', 'active', 'active', 'inactive', 'vip'][Math.floor(Math.random() * 5)],
        }))
        setCustomers(users)
      } catch (error) {
        console.error('Failed to fetch customers:', error)
        setCustomers([
          { 
            id: 1, 
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john@example.com', 
            phone: '+1 234 567 890', 
            address: { city: 'New York', country: 'USA' },
            totalOrders: 12, 
            totalSpent: '2450.50', 
            rating: '4.5',
            status: 'vip',
            joinDate: new Date(),
            lastActive: new Date()
          },
          { 
            id: 2, 
            firstName: 'Jane', 
            lastName: 'Smith', 
            email: 'jane@example.com', 
            phone: '+1 345 678 901', 
            address: { city: 'Los Angeles', country: 'USA' },
            totalOrders: 8, 
            totalSpent: '1890.00', 
            rating: '4.8',
            status: 'active',
            joinDate: new Date(),
            lastActive: new Date()
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  // Working search filter - filters by name and email
  const filteredCustomers = useMemo(() => {
    if (!search) return customers
    const query = search.toLowerCase().trim()
    return customers.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase()
      const email = (c.email || '').toLowerCase()
      const city = (c.address?.city || '').toLowerCase()
      const country = (c.address?.country || '').toLowerCase()
      return fullName.includes(query) || 
             email.includes(query) || 
             city.includes(query) || 
             country.includes(query)
    })
  }, [customers, search])

  const stats = useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => c.status === 'active' || c.status === 'vip').length
    const vip = customers.filter(c => c.status === 'vip').length
    const totalRevenue = customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0)
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0)
    return { total, active, vip, totalRevenue, totalOrders }
  }, [customers])

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      vip: 'bg-purple-100 text-purple-700'
    }
    return styles[status] || styles.active
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only administrators can view customers</p>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-purple-600 text-white p-1.5 sm:p-2 rounded-xl">
              <FaUsers className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your customer base
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Total Customers</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">+12 this month</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Active Users</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaUserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-600 mt-1">{stats.active}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">{((stats.active/stats.total)*100).toFixed(0)}% of total</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Total Orders</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">{stats.totalOrders}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">Across all customers</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-orange-600 mt-1">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] sm:text-xs text-green-600">+18.2% growth</div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-5xl mb-3">👤</div>
            <h3 className="text-lg font-semibold text-gray-900">No customers found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`
            const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
            
            return (
              <div 
                key={customer.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 text-lg sm:text-xl font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 truncate">
                        <FaEnvelope className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      {customer.address?.city && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
                          <FaMapMarker className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{customer.address.city}</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusBadge(customer.status)}`}>
                      {customer.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm sm:text-base font-bold text-gray-900">{customer.totalOrders}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Orders</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-purple-600">₹{customer.totalSpent}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Spent</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 flex items-center justify-center gap-1">
                        <FaStar className="text-yellow-500 w-3 h-3" />
                        {customer.rating}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(selectedCustomer.status)}`}>
                      {selectedCustomer.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium text-gray-900 truncate text-sm">{selectedCustomer.email}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900 text-sm">{selectedCustomer.phone || 'N/A'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {selectedCustomer.address?.city || 'N/A'}, {selectedCustomer.address?.country || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{selectedCustomer.totalOrders}</div>
                  <div className="text-xs text-gray-500">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">₹{selectedCustomer.totalSpent}</div>
                  <div className="text-xs text-gray-500">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {selectedCustomer.rating}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition font-medium text-sm">
                  View Orders
                </button>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersPage