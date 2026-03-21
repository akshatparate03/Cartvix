export default function About() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200">
          <span className="text-white font-display font-bold text-2xl">C</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-3">About Cartvix</h1>
        <p className="text-gray-500 text-lg">Redefining the way India shops online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: '🛍️', title: 'Curated Products', desc: 'Handpicked fashion and lifestyle products from top brands' },
          { icon: '✨', title: 'AI Try-On', desc: 'Industry-first AI virtual try-on for the perfect fit' },
          { icon: '🔒', title: 'Secure Shopping', desc: 'Bank-grade security for all your transactions' },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-all">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-display font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-5 text-gray-600 leading-relaxed">
        <p>Cartvix is a next-generation e-commerce platform built with passion to bring the best shopping experience to every Indian household. We combine cutting-edge AI technology with a seamless user experience to make fashion accessible and fun.</p>
        <p>Our AI-powered virtual try-on feature lets you see how clothing and accessories look on you before buying — saving you time, effort, and returns.</p>
        <p>Founded in 2026, Cartvix is powered by a team of engineers and designers who believe that the future of shopping is personal, intelligent, and delightful.</p>
      </div>
    </div>
  )
}
