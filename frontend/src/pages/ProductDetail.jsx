import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ShoppingCart, Zap, Upload, X, Loader, Edit, Trash2, ArrowLeft } from 'lucide-react'

const WEARABLE = ['Shoes','Shirts','T-Shirts','Caps','Goggles','Jewellery','Jeans','Pants','Tops','Froks']

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user, token, isAdmin } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [tryOnImage, setTryOnImage] = useState(null)
  const [tryOnResult, setTryOnResult] = useState(null)
  const [tryOnLoading, setTryOnLoading] = useState(false)
  const fileRef = useRef()

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`)
      setProduct(res.data)
    } catch { toast.error('Product not found'); navigate('/') }
    finally { setLoading(false) }
  }

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    try { await addToCart(product.id); toast.success('Added to cart!') }
    catch { toast.error('Failed to add to cart') }
  }

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return }
    try { await addToCart(product.id); navigate('/checkout') }
    catch { toast.error('Failed to proceed') }
  }

  const handleTryOn = async () => {
    if (!tryOnImage) { toast.error('Please upload a photo first'); return }
    setTryOnLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', tryOnImage)
      formData.append('productId', product.id)
      const res = await axios.post('/tryon/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      setTryOnResult(res.data.resultImageUrl)
    } catch { toast.error('Virtual try-on failed. Please try again.') }
    finally { setTryOnLoading(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Product deleted')
      navigate('/')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!product) return null

  const isWearable = WEARABLE.includes(product.category)

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square shadow-lg">
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover"
            onError={e => { e.target.src='https://via.placeholder.com/600?text=No+Image' }} />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
            {product.category}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">{product.title}</h1>
            <p className="font-display font-bold text-4xl text-orange-500 mt-3">₹{product.price?.toLocaleString()}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-2xl hover:bg-orange-50 transition-all active:scale-95">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button onClick={handleBuyNow}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95">
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {isWearable && (
            <button onClick={() => setTryOnOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 w-fit">
              ✨ Try On (AI Virtual)
            </button>
          )}

          {isAdmin && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-medium transition-colors">
                <Edit size={15} /> Edit
              </button>
              <button onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 text-sm font-medium transition-colors">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Try On Modal */}
      {tryOnOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">✨ AI Virtual Try-On</h2>
              <button onClick={() => { setTryOnOpen(false); setTryOnImage(null); setTryOnResult(null) }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-sm text-amber-800">
              <strong>Note:</strong> Please upload a photo where the body part related to this product is clearly visible.<br />
              {product.category === 'Caps' && 'For caps → head should be clearly visible.'}
              {(product.category === 'Shoes') && 'For shoes → feet should be clearly visible.'}
              {(['Shirts','T-Shirts','Tops'].includes(product.category)) && 'For tops → upper body should be clearly visible.'}
              {(['Jeans','Pants','Froks'].includes(product.category)) && 'For bottoms → lower body should be clearly visible.'}
              {product.category === 'Goggles' && 'For goggles → face should be clearly visible.'}
              {product.category === 'Jewellery' && 'For jewellery → neck/wrist should be clearly visible.'}
            </div>

            {!tryOnResult ? (
              <>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                  {tryOnImage ? (
                    <div className="space-y-2">
                      <img src={URL.createObjectURL(tryOnImage)} alt="preview" className="h-32 mx-auto rounded-xl object-cover" />
                      <p className="text-sm text-green-600 font-medium">✓ Photo uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload size={32} className="mx-auto text-gray-400" />
                      <p className="text-sm font-medium text-gray-600">Click to upload your photo</p>
                      <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => setTryOnImage(e.target.files[0])} />
                <button onClick={handleTryOn} disabled={!tryOnImage || tryOnLoading}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {tryOnLoading ? <><Loader size={18} className="animate-spin" /> Generating...</> : '✨ Generate Try-On'}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <img src={tryOnResult} alt="try-on result" className="w-full rounded-2xl shadow-lg" />
                <div className="flex gap-3">
                  <button onClick={() => { setTryOnResult(null); setTryOnImage(null) }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                    Try Again
                  </button>
                  <a href={tryOnResult} download="cartvix-tryon.jpg"
                    className="flex-1 py-2.5 bg-purple-500 text-white text-center rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors">
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
