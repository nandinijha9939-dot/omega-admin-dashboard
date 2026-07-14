import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CategoriesPage from './pages/CategoriesPage'
import CustomersPage from './pages/CustomersPage'
import OrdersPage from './pages/OrdersPage'
import MyOrdersPage from './pages/MyOrdersPage'
import ProtectedRoute from './components/Common/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Login page - first route */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirect root to login if not authenticated */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Protected routes - require authentication */}
      <Route element={<Layout />}>
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute requiredRole="admin"><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute requiredRole="admin"><CustomersPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute requiredRole="admin"><OrdersPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App