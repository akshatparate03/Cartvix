import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,54,33,0.2)";
        e.currentTarget.style.boxShadow =
          "0 20px 60px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,54,33,0.1)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "1", background: "rgba(255,255,255,0.02)" }}
        >
          <img
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ filter: "brightness(0.9) contrast(1.05)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.filter = "brightness(1) contrast(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "brightness(0.9) contrast(1.05)";
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />

          {/* Category badge */}
          {product.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                background: "rgba(13,13,15,0.8)",
                backdropFilter: "blur(10px)",
                color: "var(--text-secondary)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {product.category}
            </span>
          )}

          {/* Hover actions */}
          <div
            className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              transform: "translateX(10px)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(13,13,15,0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,54,33,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,54,33,0.3)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(13,13,15,0.85)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <Eye size={14} />
            </Link>
          </div>

          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out",
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3
            className="font-semibold text-sm mb-1 line-clamp-1 transition-colors duration-200"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
          >
            {product.title}
          </h3>
          <p
            className="text-xs line-clamp-2 mb-3"
            style={{ color: "var(--text-tertiary)", lineHeight: 1.5 }}
          >
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                background:
                  "linear-gradient(135deg, var(--text-primary), rgba(255,200,180,0.8))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 relative overflow-hidden"
            style={{
              background: adding
                ? "rgba(34,197,94,0.15)"
                : "rgba(255,54,33,0.12)",
              color: adding ? "#4ade80" : "var(--accent)",
              border: `1px solid ${adding ? "rgba(74,222,128,0.2)" : "rgba(255,54,33,0.2)"}`,
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              if (!adding) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #ff3621, #ff6b4a)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,54,33,0.4)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!adding) {
                e.currentTarget.style.background = "rgba(255,54,33,0.12)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.borderColor = "rgba(255,54,33,0.2)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {adding ? <Zap size={13} /> : <ShoppingCart size={13} />}
            {adding ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
