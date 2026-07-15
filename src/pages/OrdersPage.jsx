import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { 
  FaShoppingBag, 
  FaSearch, 
  FaEye, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaTruck,
  FaDollarSign,
  FaChartLine,
  FaDownload,
  FaPrint,
  FaTimes
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Common/Breadcrumb'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import toast from 'react-hot-toast'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    const generateOrders = async () => {
      try {
        setLoading(true)
        const [productRes, userRes] = await Promise.all([
          axios.get('https://dummyjson.com/products?limit=30'),
          axios.get('https://dummyjson.com/users?limit=15')
        ])
        
        const products = productRes.data.products
        const users = userRes.data.users
        const statuses = ['delivered', 'processing', 'shipped', 'pending', 'cancelled']
        const paymentMethods = ['Credit Card', 'PayPal', 'Cash', 'Bank Transfer', 'Apple Pay']
        
        const ordersData = Array.from({ length: 25 }, (_, i) => {
          const user = users[i % users.length]
          const numItems = Math.floor(Math.random() * 4) + 1
          let items = []
          let total = 0
          
          for (let j = 0; j < numItems; j++) {
            const product = products[(i + j * 3) % products.length]
            const qty = Math.floor(Math.random() * 3) + 1
            const subtotal = product.price * qty
            items.push({
              ...product,
              quantity: qty,
              subtotal: subtotal
            })
            total += subtotal
          }
          
          const date = new Date()
          date.setDate(date.getDate() - Math.floor(Math.random() * 30))
          
          return {
            id: `ORD-${String(i + 1).padStart(4, '0')}`,
            customer: `${user.firstName} ${user.lastName}`,
            customerId: user.id,
            customerEmail: user.email,
            items,
            total: total.toFixed(2),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: date.toISOString().split('T')[0],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            shippingAddress: `${user.address?.address || '123 Main St'}, ${user.address?.city || 'New York'}, ${user.address?.state || 'NY'} ${user.address?.postalCode || '10001'}`,
            trackingNumber: `TRK-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`
          }
        })
        setOrders(ordersData)
      } catch (error) {
        console.error('Failed to generate orders:', error)
        toast.error('Failed to load orders')
        setOrders([
          {
            id: 'ORD-0001',
            customer: 'John Doe',
            total: '125.50',
            status: 'delivered',
            date: '2024-01-15',
            items: [],
            paymentMethod: 'Credit Card',
            shippingAddress: '123 Main St, New York, NY 10001',
            trackingNumber: 'TRK-000001'
          },
          {
            id: 'ORD-0002',
            customer: 'Jane Smith',
            total: '89.00',
            status: 'processing',
            date: '2024-01-16',
            items: [],
            paymentMethod: 'PayPal',
            shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
            trackingNumber: 'TRK-000002'
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    generateOrders()
  }, [])

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { 
        label: 'Delivered', 
        className: 'bg-green-100 text-green-700',
        icon: <FaCheckCircle className="text-green-500" />,
      },
      processing: { 
        label: 'Processing', 
        className: 'bg-blue-100 text-blue-700',
        icon: <FaClock className="text-blue-500" />,
      },
      shipped: { 
        label: 'Shipped', 
        className: 'bg-purple-100 text-purple-700',
        icon: <FaTruck className="text-purple-500" />,
      },
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-100 text-yellow-700',
        icon: <FaClock className="text-yellow-500" />,
      },
      cancelled: { 
        label: 'Cancelled', 
        className: 'bg-red-100 text-red-700',
        icon: <FaTimesCircle className="text-red-500" />,
      }
    }
    return configs[status] || configs.pending
  }

  const filteredOrders = useMemo(() => {
    let result = orders
    if (search) {
      const query = search.toLowerCase().trim()
      result = result.filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query) ||
        o.customerEmail?.toLowerCase().includes(query)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }
    return result
  }, [orders, search, statusFilter])

  const stats = useMemo(() => {
    const total = orders.length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const processing = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length
    const pending = orders.filter(o => o.status === 'pending').length
    const cancelled = orders.filter(o => o.status === 'cancelled').length
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0)
    const avgOrder = total > 0 ? revenue / total : 0
    return { total, delivered, processing, pending, cancelled, revenue, avgOrder }
  }, [orders])

  // CSV Export - Working
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export')
      return
    }
    
    const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Payment Method']
    const rows = filteredOrders.map(o => [
      o.id,
      o.customer,
      o.date,
      `₹${Math.round(o.total * 83).toLocaleString()}`,
      o.status,
      o.paymentMethod
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('📊 Orders exported successfully!')
  }

  // Print - Working
  const handlePrint = () => {
    window.print()
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only administrators can view all orders</p>
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
              <FaShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            All Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track and manage all orders from your store
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm flex items-center gap-1"
          >
            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
            Export
          </button>
          <button 
            onClick={handlePrint}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm flex items-center gap-1"
          >
            <FaPrint className="w-3 h-3 sm:w-4 sm:h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Total Orders</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Delivered</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-600 mt-1">{stats.delivered}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">{((stats.delivered/stats.total)*100).toFixed(0)}%</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Processing</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">{stats.processing}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">{((stats.processing/stats.total)*100).toFixed(0)}%</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Revenue</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-orange-600 mt-1">₹{Math.round(stats.revenue * 83).toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Avg Order</div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FaChartLine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-indigo-600 mt-1">₹{Math.round(stats.avgOrder * 83)}</div>
          <div className="text-[10px] sm:text-xs text-gray-400">Per order</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[120px] sm:min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="delivered">✅ Delivered</option>
            <option value="processing">🔄 Processing</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="pending">⏳ Pending</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
          <button
            onClick={() => { setSearch(''); setStatusFilter('all') }}
            className="px-3 sm:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Payment</th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">📦</div>
                    <p>No orders found</p>
                    <p className="text-xs">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-purple-600">
                        {order.id}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        {order.customer}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {order.date}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-900 text-right">
                        ₹{Math.round(order.total * 83).toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${statusConfig.className}`}>
                          {statusConfig.icon}
                          <span className="hidden sm:inline">{statusConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {order.paymentMethod}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-600"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl mb-4 sm:mb-6">
                <div>
                  <div className="text-xs text-gray-500">Customer</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.customer}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Payment Method</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusConfig(selectedOrder.status).className}`}>
                    {getStatusConfig(selectedOrder.status).icon}
                    {getStatusConfig(selectedOrder.status).label}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">₹{Math.round(selectedOrder.total * 83).toLocaleString()}</div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500">Tracking Number</div>
                    <div className="font-mono text-xs sm:text-sm text-gray-900">{selectedOrder.trackingNumber}</div>
                  </div>
                )}
                {selectedOrder.shippingAddress && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500">Shipping Address</div>
                    <div className="text-xs sm:text-sm text-gray-900">{selectedOrder.shippingAddress}</div>
                  </div>
                )}
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Order Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm text-gray-900 truncate">{item.title}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500">Qty: {item.quantity} × ₹{Math.round(item.price * 83)}</div>
                        </div>
                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">₹{Math.round(item.subtotal * 83).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Close
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage