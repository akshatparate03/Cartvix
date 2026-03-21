import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import axios from '../utils/axios'
import { Package } from 'lucide-react'

export default function Home({ selectedCategory }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ sort: 'latest' })

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)
      if (filters.sort) params.append('sort', filters.sort)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      const res = await axios.get(`/products?${params}`)
      setProducts(res.data || [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            {selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products found</p>
        </div>
        <FilterBar onFilterChange={setFilters} currentFilters={filters} />
      </div>

      {/* Banner */}
      {(!selectedCategory || selectedCategory === 'all') && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
          <div className="relative z-10">
            <p className="text-orange-100 font-medium mb-2">🔥 Hot Deals</p>
            <h2 className="font-display font-bold text-3xl mb-3">Shop the Latest Trends</h2>
            <p className="text-orange-100">Discover premium fashion with AI virtual try-on</p>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[8rem] opacity-10">🛍️</div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Package size={48} className="mb-4 opacity-50" />
          <p className="font-display font-bold text-xl">No products found</p>
          <p className="text-sm mt-2">Try changing your filters or category</p>
        </div>
      )}
    </div>
  )
}
