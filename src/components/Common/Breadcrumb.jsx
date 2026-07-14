import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronRight, FaHome } from 'react-icons/fa'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null

  return (
    <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm mb-3 sm:mb-4 text-gray-500 flex-wrap overflow-x-auto pb-1">
      <Link to="/products" className="hover:text-purple-600 transition flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <FaHome className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const displayName = name.replace(/-/g, ' ')
        
        return (
          <React.Fragment key={name}>
            <FaChevronRight className="w-2 h-2 sm:w-3 sm:h-3 text-gray-300 flex-shrink-0" />
            {isLast ? (
              <span className="text-gray-900 font-medium capitalize truncate max-w-[80px] sm:max-w-[150px]">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-purple-600 transition capitalize truncate max-w-[60px] sm:max-w-[100px]">
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