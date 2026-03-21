import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    try {
      await addToCart(product.id)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-100 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://via.placeholder.com/300?text=No+Image' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <Link to={`/product/${product.id}`} onClick={e => e.stopPropagation()}
              className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-orange-50 transition-colors">
              <Eye size={16} className="text-gray-700" />
            </Link>
          </div>
          {product.category && (
            <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-lg">
              {product.category}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-orange-500 transition-colors">{product.title}</h3>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-gray-900">₹{product.price?.toLocaleString()}</span>
          <button onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition-all active:scale-95 hover:shadow-lg">
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
