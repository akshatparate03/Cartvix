import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'

const CATEGORIES = ['Shoes','Shirts','T-Shirts','Caps','Goggles','Jewellery','Jeans','Pants','Tops','Froks','Watches','Bags','Other']

export default function AdminProduct() {
  const { id } = useParams()
  const isEdit = !!id
  const { token, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', price: '', description: '', imageUrl: '' })

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    if (isEdit) fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`)
      const p = res.data
      setForm({ title: p.title, category: p.category, price: p.price, description: p.description, imageUrl: p.imageUrl })
    } catch { toast.error('Product not found'); navigate('/') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.price || !form.imageUrl) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    try {
      if (isEdit) {
        await axios.put(`/products/${id}`, { ...form, price: parseFloat(form.price) }, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Product updated!')
      } else {
        await axios.post('/products', { ...form, price: parseFloat(form.price) }, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Product added!')
      }
      navigate('/')
    } catch { toast.error('Failed to save product') }
    finally { setLoading(false) }
  }

  if (!isAdmin) return null

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 space-y-5 shadow-sm">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Product Title *</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Nike Air Max"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Category *</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white transition-all">
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 1499"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Image URL *</label>
          <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
          {form.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden w-32 h-32">
              <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none' }} />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4}
            placeholder="Product description..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all resize-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          <Save size={18} /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
