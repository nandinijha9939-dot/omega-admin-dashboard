import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronRight, FaHome } from 'react-icons/fa'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm mb-4 text-gray-500 flex-wrap">
      <Link to="/products" className="hover:text-purple-600 transition flex items-center gap-1">
        <FaHome className="w-3 h-3" />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const displayName = name.replace(/-/g, ' ')
        
        return (
          <React.Fragment key={name}>
            <FaChevronRight className="w-3 h-3 text-gray-300" />
            {isLast ? (
              <span className="text-gray-900 font-medium capitalize truncate max-w-[150px]">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-purple-600 transition capitalize">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb