import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "all", label: "All Products", icon: "🛍️" },
  { id: "Shoes", label: "Shoes", icon: "👟" },
  { id: "Shirts", label: "Shirts", icon: "👔" },
  { id: "T-Shirts", label: "T-Shirts", icon: "👕" },
  { id: "Caps", label: "Caps", icon: "🧢" },
  { id: "Goggles", label: "Goggles", icon: "🕶️" },
  { id: "Jewellery", label: "Jewellery", icon: "💍" },
  { id: "Jeans", label: "Jeans", icon: "👖" },
  { id: "Pants", label: "Pants", icon: "🩳" },
  { id: "Tops", label: "Tops", icon: "👚" },
  { id: "Froks", label: "Froks", icon: "👗" },
  { id: "Watches", label: "Watches", icon: "⌚" },
  { id: "Bags", label: "Bags", icon: "👜" },
];

export default function Sidebar({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
}) {
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    onCategorySelect(catId);
    onClose();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 overflow-y-auto scrollbar-hide transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background: "rgba(13,13,15,0.9)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Decorative top gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            background:
              "radial-gradient(ellipse at top left, rgba(255,54,33,0.08), transparent)",
            pointerEvents: "none",
          }}
        />

        <div className="p-5 relative z-10">
          {/* Mobile close */}
          <div className="flex items-center justify-between mb-5 lg:hidden">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              Categories
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "var(--text-secondary)",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:flex items-center gap-2 mb-5 px-1">
            <div
              style={{
                width: 3,
                height: 16,
                borderRadius: 2,
                background: "linear-gradient(180deg, #ff3621, #ff8060)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Categories
            </span>
          </div>

          <div className="space-y-1">
            {CATEGORIES.map((cat, i) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                  style={{
                    background: isActive
                      ? "rgba(255,54,33,0.1)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,54,33,0.2)"
                      : "1px solid transparent",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                    animationDelay: `${i * 0.03}s`,
                    transform: "translateX(0)",
                    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      filter: isActive ? "none" : "grayscale(0.3)",
                    }}
                  >
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--accent)",
                        boxShadow: "0 0 8px rgba(255,54,33,0.6)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
