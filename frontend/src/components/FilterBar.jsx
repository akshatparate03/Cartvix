import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FilterBar({ onFilterChange, currentFilters }) {
  const [showFilters, setShowFilters] = useState(false)

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-300 transition-colors">
        <SlidersHorizontal size={16} /> Filters
        <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {/* Sort */}
      <select value={currentFilters.sort || 'latest'}
        onChange={e => onFilterChange({ ...currentFilters, sort: e.target.value })}
        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer">
        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>

      {showFilters && (
        <div className="w-full flex items-center gap-4 flex-wrap animate-slide-down bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Price Range:</label>
            <input type="number" placeholder="Min ₹" value={currentFilters.minPrice || ''}
              onChange={e => onFilterChange({ ...currentFilters, minPrice: e.target.value })}
              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <span className="text-gray-400">—</span>
            <input type="number" placeholder="Max ₹" value={currentFilters.maxPrice || ''}
              onChange={e => onFilterChange({ ...currentFilters, maxPrice: e.target.value })}
              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <button onClick={() => onFilterChange({ sort: 'latest' })}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium">Clear All</button>
        </div>
      )}
    </div>
  )
}
