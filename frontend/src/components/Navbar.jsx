import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, LogOut, Plus, X, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import axios from '../utils/axios'

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)
  const dropRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults([])
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (q.trim().length < 2) { setSearchResults([]); return }
    try {
      const res = await axios.get(`/products/search?q=${encodeURIComponent(q)}`)
      setSearchResults(res.data.slice(0, 6))
    } catch { setSearchResults([]) }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">Cartvix</span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-auto relative" ref={searchRef}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]) }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down z-50">
              {searchResults.map(p => (
                <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); setSearchResults([]); setSearchQuery('') }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors">
                  <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.title}</p>
                    <p className="text-xs text-orange-500 font-semibold">₹{p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50">Home</Link>
          <Link to="/about" className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50">About</Link>

          {isAdmin && (
            <Link to="/admin/add-product" className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
              <Plus size={14} /> Add Product
            </Link>
          )}

          <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <ShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all">
                {user.fullName?.charAt(0).toUpperCase()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    {isAdmin && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Admin</span>}
                  </div>
                  {isAdmin && (
                    <Link to="/admin/add-product" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                      <Plus size={16} className="text-orange-500" /> Add Product
                    </Link>
                  )}
                  <button onClick={() => { logout(); setShowDropdown(false); navigate('/') }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all hover:shadow-lg active:scale-95">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
