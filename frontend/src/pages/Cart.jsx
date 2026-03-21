import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <ShoppingBag size={56} className="text-gray-300 mb-4" />
      <h2 className="font-display font-bold text-2xl text-gray-700 mb-2">Sign in to view cart</h2>
      <p className="text-gray-500 mb-6">You need to be logged in to access your cart</p>
      <Link to="/login" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-colors">Login</Link>
    </div>
  )

  if (cartItems.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <ShoppingBag size={56} className="text-gray-300 mb-4" />
      <h2 className="font-display font-bold text-2xl text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-colors">Shop Now</Link>
    </div>
  )

  const total = cartItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-all animate-slide-up">
              <img src={item.product?.imageUrl} alt={item.product?.title}
                className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                onError={e => { e.target.src='https://via.placeholder.com/80' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.product?.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.product?.category}</p>
                <p className="font-display font-bold text-orange-500 mt-1">₹{item.product?.price?.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <button onClick={() => { removeFromCart(item.id); toast.success('Removed from cart') }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-700">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate mr-2">{i.product?.title} × {i.quantity}</span>
                  <span className="font-medium text-gray-700 flex-shrink-0">₹{((i.product?.price||0)*i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-display font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-500">₹{total.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2">
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
