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
  FaUserPlus,
  FaUserCheck,
  FaChartLine
} from 'react-icons/fa'
import LoadingSpinner from '../components/Common/LoadingSpinner'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://dummyjson.com/users?limit=30')
        // Enhance with mock order data
        const users = response.data.users.map((user, index) => ({
          ...user,
          totalOrders: Math.floor(Math.random() * 25) + 2,
          totalSpent: (Math.random() * 5000 + 200).toFixed(2),
          rating: (Math.random() * 2 + 3).toFixed(1),
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: ['active', 'active', 'active', 'inactive', 'vip'][Math.floor(Math.random() * 5)],
          avatar: `https://i.pravatar.cc/150?img=${index + 1}`
        }))
        setCustomers(users)
      } catch (error) {
        console.error('Failed to fetch customers:', error)
        // Fallback data
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
            avatar: 'https://i.pravatar.cc/150?img=1'
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!search) return customers
    const query = search.toLowerCase()
    return customers.filter(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.address?.city || '').toLowerCase().includes(query) ||
      (c.address?.country || '').toLowerCase().includes(query)
    )
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

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-xl">
              <FaUsers className="w-6 h-6" />
            </span>
            Customers
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your customer relationships</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 md:w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Customers</div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</div>
          <div className="text-xs text-green-600 mt-1">+12 this month</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Users</div>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaUserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.active}</div>
          <div className="text-xs text-gray-500 mt-1">{((stats.active / stats.total) * 100).toFixed(0)}% of total</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">VIP Members</div>
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <FaStar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.vip}</div>
          <div className="text-xs text-purple-600 mt-1">⭐ Premium customers</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</div>
          <div className="text-xs text-gray-500 mt-1">Across all customers</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">+18.2% from last month</div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`
          const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
          
          return (
            <div 
              key={customer.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedCustomer(customer)}
            >
              {/* Header with gradient background */}
              <div className="relative h-20 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={customer.avatar || `https://i.pravatar.cc/150?img=${customer.id}`}
                    alt={fullName}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{fullName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(customer.status)}`}>
                      {customer.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {customer.status === 'vip' && (
                    <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
                      VIP
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEnvelope className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                
                {customer.address?.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarker className="w-4 h-4 text-gray-400" />
                    <span>{customer.address.city}, {customer.address.country || 'USA'}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{customer.totalOrders}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-600">${customer.totalSpent}</div>
                    <div className="text-xs text-gray-500">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
                      <FaStar className="text-yellow-500 w-3 h-3" />
                      {customer.rating}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Joined: {new Date(customer.joinDate).toLocaleDateString()}</span>
                  <span>Last active: {new Date(customer.lastActive).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-gray-900">No customers found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 p-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedCustomer.avatar || `https://i.pravatar.cc/150?img=${selectedCustomer.id}`}
                    alt={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(selectedCustomer.status)}`}>
                        {selectedCustomer.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                      {selectedCustomer.status === 'vip' && (
                        <span className="bg-yellow-400 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">
                          ⭐ VIP
                        </span>
                      )}
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

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-900 truncate">{selectedCustomer.email}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{selectedCustomer.phone || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="font-medium text-gray-900">
                      {selectedCustomer.address?.city || 'N/A'}, {selectedCustomer.address?.country || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</div>
                    <div className="text-xs text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">${selectedCustomer.totalSpent}</div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                      <FaStar className="text-yellow-500" />
                      {selectedCustomer.rating}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                    View Orders
                  </button>
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersPage