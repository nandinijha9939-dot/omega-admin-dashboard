import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login'
import ProtectedRoute from './components/Common/ProtectedRoute'
import LoadingSpinner from './components/Common/LoadingSpinner'
import NotFoundPage from './pages/NotFoundPage'

// Lazy load pages for performance
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const CustomersPage = lazy(() => import('./pages/CustomersPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))

function App() {
  return (
    <>
      {/* Toast Notifications */}
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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Protected Routes - Requires Authentication */}
        <Route element={<Layout />}>
          {/* Both Admin & User can access */}
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <UserProfilePage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <WishlistPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          {/* Admin Only Routes */}
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
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App