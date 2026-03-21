import { X } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '🛍️' },
  { id: 'Shoes', label: 'Shoes', icon: '👟' },
  { id: 'Shirts', label: 'Shirts', icon: '👔' },
  { id: 'T-Shirts', label: 'T-Shirts', icon: '👕' },
  { id: 'Caps', label: 'Caps', icon: '🧢' },
  { id: 'Goggles', label: 'Goggles', icon: '🕶️' },
  { id: 'Jewellery', label: 'Jewellery', icon: '💍' },
  { id: 'Jeans', label: 'Jeans', icon: '👖' },
  { id: 'Pants', label: 'Pants', icon: '🩳' },
  { id: 'Tops', label: 'Tops', icon: '👚' },
  { id: 'Froks', label: 'Froks', icon: '👗' },
  { id: 'Watches', label: 'Watches', icon: '⌚' },
  { id: 'Bags', label: 'Bags', icon: '👜' },
]

export default function Sidebar({ isOpen, onClose, selectedCategory, onCategorySelect }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 overflow-y-auto scrollbar-hide
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-display font-bold text-gray-800">Categories</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
          </div>
          <h2 className="hidden lg:block font-display font-bold text-gray-800 mb-4 px-2">Categories</h2>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { onCategorySelect(cat.id); onClose() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
