import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ShoppingCart, Zap, Edit, Trash2, ArrowLeft, Tag } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token, isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });
  const imgRef = useRef();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    } catch {
      toast.error("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id);
      navigate("/checkout");
    } catch {
      toast.error("Failed to proceed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleImgMouseMove = (e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setImgTilt({ x: y * -8, y: x * 8 });
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid rgba(255,54,33,0.3)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  if (!product) return null;

  return (
    <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20,
          fontSize: 13,
          color: "var(--text-tertiary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--text-secondary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-tertiary)")
        }
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div
          ref={imgRef}
          onMouseMove={handleImgMouseMove}
          onMouseLeave={() => setImgTilt({ x: 0, y: 0 })}
          style={{
            position: "relative",
            borderRadius: 22,
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
            transform: `perspective(800px) rotateX(${imgTilt.x}deg) rotateY(${imgTilt.y}deg)`,
            transition: "transform 0.15s ease, box-shadow 0.3s ease",
            willChange: "transform",
            maxHeight: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              padding: "12px",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500?text=No+Image";
            }}
          />
          {/* Category badge — clickable, navigates to home with that category */}
          <button
            onClick={() =>
              navigate("/", { state: { category: product.category } })
            }
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "rgba(13,13,15,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 8,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,54,33,0.15)";
              e.currentTarget.style.borderColor = "rgba(255,54,33,0.3)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(13,13,15,0.85)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Tag size={9} />
            {product.category}
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background:
                "linear-gradient(to top, rgba(13,13,15,0.4), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(22px, 3.5vw, 32px)",
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1.15,
                marginBottom: 10,
              }}
            >
              {product.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 34,
                background: "linear-gradient(135deg, #ff3621, #ff8060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {product.price?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            {product.description}
          </p>

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              onClick={handleAddToCart}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.7rem 1.4rem",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                background: "rgba(255,54,33,0.1)",
                border: "1px solid rgba(255,54,33,0.25)",
                color: "var(--accent)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,54,33,0.18)";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,54,33,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,54,33,0.1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <ShoppingCart size={15} /> Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-glow"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.7rem 1.4rem",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                color: "white",
              }}
            >
              <Zap size={15} /> Buy Now
            </button>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div
              style={{
                display: "flex",
                gap: 10,
                paddingTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.5rem 1rem",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  color: "#60a5fa",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                }}
              >
                <Edit size={13} /> Edit
              </button>
              <button
                onClick={handleDelete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.5rem 1rem",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,107,107,0.08)",
                  border: "1px solid rgba(255,107,107,0.15)",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,107,107,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,107,107,0.08)";
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
