import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
    <div
      className="flex flex-col items-center justify-center text-center rounded-2xl"
      style={{
        minHeight: "60vh",
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.06)",
        animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: "rgba(255,54,33,0.06)",
          border: "1px solid rgba(255,54,33,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Icon size={36} style={{ color: "rgba(255,54,33,0.3)" }} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 22,
          color: "var(--text-secondary)",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "var(--text-tertiary)",
          marginBottom: 24,
        }}
      >
        {subtitle}
      </p>
      {action}
    </div>
  );

  if (!user)
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Sign in to view cart"
        subtitle="You need to be logged in to access your cart"
        action={
          <Link
            to="/login"
            className="btn-glow"
            style={{
              padding: "0.7rem 2rem",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "white",
            }}
          >
            Login <ArrowRight size={15} />
          </Link>
        }
      />
    );

  if (cartItems.length === 0)
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        subtitle="Add some products to get started"
        action={
          <Link
            to="/"
            className="btn-glow"
            style={{
              padding: "0.7rem 2rem",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "white",
            }}
          >
            Shop Now <ArrowRight size={15} />
          </Link>
        }
      />
    );

  const total = cartItems.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0,
  );

  return (
    <div
      className="max-w-5xl mx-auto"
      style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
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
            Your Cart
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
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item, i) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1)`,
                animationDelay: `${i * 0.06}s`,
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,54,33,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/84";
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                    marginBottom: 3,
                  }}
                  className="line-clamp-1"
                >
                  {item.product?.title}
                </h3>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.product?.category}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    background: "linear-gradient(135deg, #ff3621, #ff8060)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {item.product?.price?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.success("Removed from cart");
                  }}
                  style={{
                    padding: "6px",
                    borderRadius: 8,
                    background: "rgba(255,107,107,0.06)",
                    border: "1px solid rgba(255,107,107,0.1)",
                    color: "rgba(255,107,107,0.5)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,107,0.12)";
                    e.currentTarget.style.color = "#ff6b6b";
                    e.currentTarget.style.borderColor = "rgba(255,107,107,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,107,0.06)";
                    e.currentTarget.style.color = "rgba(255,107,107,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,107,107,0.1)";
                  }}
                >
                  <Trash2 size={13} />
                </button>

                {/* Quantity */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    padding: "4px 8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateQuantity(item.id, Math.max(1, item.quantity - 1));
                    }}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,54,33,0.15)";
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,54,33,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <Minus size={12} />
                  </button>
                  <span
                    style={{
                      width: 22,
                      textAlign: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                      userSelect: "none",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,54,33,0.15)";
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,54,33,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                  }}
                >
                  {((item.product?.price || 0) * item.quantity).toLocaleString(
                    "en-IN",
                    {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    },
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "1.5rem",
              position: "sticky",
              top: 88,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {cartItems.map((i) => (
                <div
                  key={i.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-tertiary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: 8,
                      maxWidth: "60%",
                    }}
                  >
                    {i.product?.title} x {i.quantity}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                    }}
                  >
                    {((i.product?.price || 0) * i.quantity).toLocaleString(
                      "en-IN",
                      {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-primary)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 20,
                    background: "linear-gradient(135deg, #ff3621, #ff8060)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {total.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-glow"
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "white",
              }}
            >
              Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
