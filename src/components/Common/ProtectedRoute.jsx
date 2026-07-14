import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAdmin } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/products" replace />
  }
  
  return children
}

export default ProtectedRoute