import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { PackageSearch, ChevronRight, ShoppingBag } from "lucide-react";
import { TRACKING_STAGES } from "../components/OrderTracker";

// FEATURE: "My Orders" — lets a logged-in customer see every order they've
// placed and its current tracking stage at a glance. Clicking an order
// opens the full tracking timeline (OrderDetail page).
export default function MyOrders() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const stageInfo = (status) => {
    const idx = TRACKING_STAGES.findIndex((s) => s.key === status);
    return TRACKING_STAGES[idx === -1 ? 0 : idx];
  };

  if (!user) return null;

  return (
    <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
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
            Your Orders
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
          My Orders
        </h1>
      </div>

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

      {!loading && orders.length === 0 && (
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
            <PackageSearch size={26} style={{ color: "var(--accent)" }} />
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
            No orders yet
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginBottom: 24,
            }}
          >
            Start shopping and your orders will show up here.
          </p>
          <Link
            to="/"
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
            <ShoppingBag size={15} /> Start Shopping
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => {
            const stage = stageInfo(o.status);
            const StageIcon = stage.icon;
            return (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "1rem 1.2rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  textDecoration: "none",
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
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: "rgba(255,54,33,0.1)",
                    border: "1px solid rgba(255,54,33,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StageIcon size={19} style={{ color: "var(--accent)" }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Order #{o.id}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginTop: 2,
                    }}
                  >
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}{" "}
                    · ₹{o.totalAmount?.toLocaleString()}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 100,
                    background: "rgba(255,54,33,0.1)",
                    color: "var(--accent)",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {stage.label}
                </span>

                <ChevronRight
                  size={16}
                  style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
