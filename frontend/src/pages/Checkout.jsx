import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import toast from 'react-hot-toast'
import { MapPin, CreditCard, Smartphone, Building2, CheckCircle2, Loader } from 'lucide-react'

export default function Checkout() {
  const { cartItems, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [payMethod, setPayMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [address, setAddress] = useState({ fullName: user?.fullName || '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', upiId: '', bank: '', accountNumber: '' })

  const total = cartItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)

  const detectLocation = () => {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(async pos => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
        const data = await res.json()
        const ad = data.address
        setAddress(prev => ({
          ...prev,
          address: [ad.road, ad.suburb, ad.neighbourhood].filter(Boolean).join(', '),
          city: ad.city || ad.town || ad.village || '',
          state: ad.state || '',
          pincode: ad.postcode || ''
        }))
        toast.success('Location detected!')
      } catch { toast.error('Could not fetch address') }
      finally { setLocating(false) }
    }, () => { toast.error('Location access denied'); setLocating(false) })
  }

  const placeOrder = async () => {
    const required = ['fullName', 'phone', 'address', 'city', 'state', 'pincode']
    for (const f of required) if (!address[f]) { toast.error(`Please fill ${f}`); return }
    setLoading(true)
    try {
      await axios.post('/orders/place', {
        shippingAddress: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
        fullName: address.fullName, phone: address.phone,
        paymentMethod: payMethod, totalAmount: total
      }, { headers: { Authorization: `Bearer ${token}` } })
      await clearCart()
      setSuccess(true)
    } catch { toast.error('Failed to place order') }
    finally { setLoading(false) }
  }

  if (!user) return navigate('/login')

  if (success) return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-scale-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Order Placed! 🎉</h2>
      <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
      <p className="text-sm text-gray-400 mb-8">Total: <span className="font-bold text-orange-500">₹{total.toLocaleString()}</span></p>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-colors">
        Continue Shopping
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><MapPin size={18} className="text-orange-500" /> Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['fullName','Full Name'],['phone','Phone Number']].map(([k,l]) => (
                <input key={k} placeholder={l} value={address[k]} onChange={e => setAddress({...address,[k]:e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
              ))}
              <div className="sm:col-span-2 relative">
                <input placeholder="Address" value={address.address} onChange={e => setAddress({...address,address:e.target.value})}
                  className="w-full px-4 py-3 pr-36 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
                <button onClick={detectLocation} disabled={locating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium">
                  {locating ? <Loader size={12} className="animate-spin" /> : <MapPin size={12} />}
                  {locating ? 'Locating...' : 'Detect'}
                </button>
              </div>
              {[['city','City'],['state','State'],['pincode','Pincode']].map(([k,l]) => (
                <input key={k} placeholder={l} value={address[k]} onChange={e => setAddress({...address,[k]:e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{id:'card',icon:<CreditCard size={18}/>,label:'Card'},{id:'upi',icon:<Smartphone size={18}/>,label:'UPI'},{id:'netbanking',icon:<Building2 size={18}/>,label:'Net Banking'}].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
                    ${payMethod === m.id ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="space-y-3 animate-slide-up">
                <input placeholder="Card Number (1234 5678 9012 3456)" value={payment.cardNumber} onChange={e => setPayment({...payment,cardNumber:e.target.value})}
                  maxLength={19} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment({...payment,expiry:e.target.value})} maxLength={5}
                    className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <input placeholder="CVV" value={payment.cvv} onChange={e => setPayment({...payment,cvv:e.target.value})} maxLength={3} type="password"
                    className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
            )}
            {payMethod === 'upi' && (
              <input placeholder="UPI ID (e.g. name@upi)" value={payment.upiId} onChange={e => setPayment({...payment,upiId:e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 animate-slide-up" />
            )}
            {payMethod === 'netbanking' && (
              <div className="space-y-3 animate-slide-up">
                <select value={payment.bank} onChange={e => setPayment({...payment,bank:e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
                  <option value="">Select Bank</option>
                  {['SBI','HDFC','ICICI','Axis Bank','Kotak','PNB','Yes Bank'].map(b => <option key={b}>{b}</option>)}
                </select>
                <input placeholder="Account Number" value={payment.accountNumber} onChange={e => setPayment({...payment,accountNumber:e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
              {cartItems.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate mr-2">{i.product?.title} ×{i.quantity}</span>
                  <span className="font-medium flex-shrink-0">₹{((i.product?.price||0)*i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="text-green-500 font-medium">FREE</span></div>
              <div className="flex justify-between font-display font-bold text-lg border-t border-gray-100 pt-2 mt-2">
                <span>Total</span><span className="text-orange-500">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={placeOrder} disabled={loading || cartItems.length === 0}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader size={18} className="animate-spin" /> Placing...</> : '🎉 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
