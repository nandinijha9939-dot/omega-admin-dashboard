# Omega Admin Dashboard 🚀

A modern, fully responsive admin dashboard built with React, Vite, and Tailwind CSS. Features role-based access control, product management, analytics, and more.

## ✨ Features

### 🎯 Core Features
- **Responsive Dashboard** - Works seamlessly on desktop, tablet, and mobile
- **Authentication** - Role-based login (Admin/User)
- **Product Management** - View, search, filter, and sort products
- **Product Details** - Image carousel, description, pricing, and ratings
- **Analytics Dashboard** - Total products, average rating, inventory value, category distribution
- **URL State Sync** - All filters and search parameters reflected in URL
- **Role-Based Access** - Admin and User views with different permissions

### ⚡ Performance Optimizations
- ✅ Debounced Search (300ms delay)
- ✅ React.memo for component memoization
- ✅ useMemo for expensive computations
- ✅ useCallback for event handlers
- ✅ React.lazy + Suspense for code splitting
- ✅ Optimized re-renders

### 👑 Admin Features
- Full access to all products (including hidden)
- Toggle product visibility (Publish/Hide)
- Analytics Dashboard
- Customer management
- All orders view

### 👤 User Features
- Browse published products only
- View product details
- My Orders
- Categories browsing
- Customer notifications

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **React Icons** - Icons
- **React Hot Toast** - Notifications

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/nandinijha9939-dot/omega-admin-dashboard.git

# Navigate to project directory
cd omega-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
