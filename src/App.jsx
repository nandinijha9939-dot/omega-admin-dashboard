import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login'
import ProtectedRoute from './components/Common/ProtectedRoute'
import LoadingSpinner from './components/Common/LoadingSpinner'

// Lazy load pages
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const CustomersPage = lazy(() => import('./pages/CustomersPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'))

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#22c55e',
            },
            icon: '✅',
          },
          error: {
            style: {
              background: '#ef4444',
            },
            icon: '❌',
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route element={<Layout />}>
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductDetailPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <CategoriesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <MyOrdersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<LoadingSpinner />}>
                  <AnalyticsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<LoadingSpinner />}>
                  <CustomersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<LoadingSpinner />}>
                  <OrdersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          {/* Redirect any unknown routes to products */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App