import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Package, Store } from "lucide-react";

// FEATURE: "My Products" — a seller-only dashboard. Mirrors the admin's
// product management powers (add / edit / delete) but scoped to only the
// products this seller has personally listed. Sellers reach this page via
// the Navbar dropdown ("My Products" link).
export default function SellerProducts() {
  const { token, isAdmin, isSeller, canManageProducts } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!canManageProducts) {
      navigate("/");
      return;
    }
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/products/seller/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (!canManageProducts) return null;

  return (
    <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 3,
                height: 20,
                borderRadius: 2,
                background: "linear-gradient(180deg, #ff3621, #ff8060)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {isAdmin ? "Admin Panel" : "Seller Dashboard"}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            My Products
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            {products.length} product{products.length !== 1 ? "s" : ""} listed
          </p>
        </div>

        <Link
          to="/admin/add-product"
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
            textDecoration: "none",
            color: "white",
          }}
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 240,
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
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(255,54,33,0.08)",
              border: "1px solid rgba(255,54,33,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Store size={26} style={{ color: "var(--accent)" }} />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            No products yet
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginBottom: 24,
              maxWidth: 320,
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            List your first product and start selling on Cartvix.
          </p>
          <Link
            to="/admin/add-product"
            className="btn-glow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.7rem 1.4rem",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
              color: "white",
            }}
          >
            <Plus size={15} /> Add Your First Product
          </Link>
        </div>
      )}

      {/* Products table/list */}
      {!loading && products.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0.9rem 1.1rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,54,33,0.2)";
                e.currentTarget.style.background = "rgba(255,255,255,0.045)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <img
                  src={p.imageUrl || "https://via.placeholder.com/100"}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="line-clamp-1"
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {p.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {p.category}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--accent)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    ₹{p.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link
                  to={`/admin/edit-product/${p.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0.5rem 0.9rem",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    color: "#60a5fa",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                  }}
                >
                  <Edit size={12} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0.5rem 0.9rem",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "rgba(255,107,107,0.08)",
                    border: "1px solid rgba(255,107,107,0.15)",
                    color: "#ff6b6b",
                    cursor: deletingId === p.id ? "not-allowed" : "pointer",
                    opacity: deletingId === p.id ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== p.id)
                      e.currentTarget.style.background =
                        "rgba(255,107,107,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,107,0.08)";
                  }}
                >
                  <Trash2 size={12} />
                  {deletingId === p.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
