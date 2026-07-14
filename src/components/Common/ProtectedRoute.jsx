import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAdmin } = useAuth()
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // If admin role is required but user is not admin
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/products" replace />
  }
  
  return children
}

export default ProtectedRoute