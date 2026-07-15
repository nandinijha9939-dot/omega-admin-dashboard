import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa'

const MultiCategoryFilter = ({ categories, selectedCategories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category))
    } else {
      onChange([...selectedCategories, category])
    }
  }

  const clearAll = () => {
    onChange([])
    setIsOpen(false)
  }

  const selectAll = () => {
    onChange(categories.map(c => c))
    setIsOpen(false)
  }

  const displayText = selectedCategories.length === 0 
    ? 'All Categories'
    : `${selectedCategories.length} selected`

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white flex items-center justify-between min-w-[160px]"
      >
        <span className="truncate">{displayText}</span>
        {isOpen ? <FaChevronUp className="w-4 h-4 text-gray-400" /> : <FaChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto p-2">
          <div className="flex gap-2 mb-2 pb-2 border-b border-gray-100">
            <button
              onClick={selectAll}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
          </div>

          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 capitalize">{category}</span>
            </label>
          ))}

          {selectedCategories.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
              {selectedCategories.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {cat}
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="hover:text-purple-900"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiCategoryFilter