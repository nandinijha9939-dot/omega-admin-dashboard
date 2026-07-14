import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaEye } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const MyOrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateOrders = async () => {
      try {
        const productRes = await axios.get('https://dummyjson.com/products?limit=30')
        const products = productRes.data.products
        
        const statuses = ['delivered', 'shipped', 'processing', 'pending']
        const orderCount = Math.floor(Math.random() * 5) + 2
        
        const userOrders = Array.from({ length: orderCount }, (_, i) => {
          const numItems = Math.floor(Math.random() * 3) + 1
          let items = []
          let total = 0
          
          for (let j = 0; j < numItems; j++) {
            const product = products[(i + j * 2) % products.length]
            const qty = Math.floor(Math.random() * 2) + 1
            const subtotal = product.price * qty
            items.push({ ...product, quantity: qty, subtotal })
            total += subtotal
          }
          
          const date = new Date()
          date.setDate(date.getDate() - Math.floor(Math.random() * 30))
          
          return {
            id: `ORD-${String(i + 1).padStart(4, '0')}`,
            items,
            total: total.toFixed(2),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: date.toISOString().split('T')[0],
            estimatedDelivery: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          }
        })
        
        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to generate orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    
    generateOrders()
  }, [])

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { 
        icon: <FaCheckCircle className="text-green-500" />,
        label: 'Delivered',
        className: 'bg-green-100 text-green-700'
      },
      shipped: { 
        icon: <FaTruck className="text-blue-500" />,
        label: 'Shipped',
        className: 'bg-blue-100 text-blue-700'
      },
      processing: { 
        icon: <FaClock className="text-yellow-500" />,
        label: 'Processing',
        className: 'bg-yellow-100 text-yellow-700'
      },
      pending: { 
        icon: <FaClock className="text-orange-500" />,
        label: 'Pending',
        className: 'bg-orange-100 text-orange-700'
      }
    }
    return configs[status] || configs.pending
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-xl">
              <FaBox className="w-5 h-5" />
            </span>
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} orders placed
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 text-sm">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusConfig(order.status)
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-500">Order #{order.id}</span>
                    <span className="text-gray-500">Placed on {order.date}</span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{Math.round(item.price * 83)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₹{Math.round(item.subtotal * 83)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Estimated Delivery: <span className="font-medium text-gray-900">{order.estimatedDelivery}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Order Total</div>
                      <div className="text-xl font-bold text-gray-900">₹{Math.round(order.total * 83)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage