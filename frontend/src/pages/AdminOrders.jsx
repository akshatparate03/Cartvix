import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ClipboardList, ChevronRight } from "lucide-react";
import { TRACKING_STAGES } from "../components/OrderTracker";

// FEATURE: admin's "Manage Orders" dashboard — every order on the
// platform in one place, with a quick dropdown to advance each order's
// manual tracking stage without opening the full detail page.
export default function AdminOrders() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      toast.success(`Order #${orderId} → ${newStatus.replace(/_/g, " ")}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) return null;

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
            Admin Panel
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
          Manage Orders
        </h1>
        <p
          style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}
        >
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>
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
          <ClipboardList
            size={32}
            style={{ color: "var(--text-tertiary)", margin: "0 auto 14px" }}
          />
          <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
            No orders have been placed yet.
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "1rem 1.2rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 160 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Order #{o.id} — {o.fullName}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    marginTop: 2,
                  }}
                >
                  {o.createdAt &&
                    new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                  · ₹{o.totalAmount?.toLocaleString()} · {o.phone}
                </p>
              </div>

              <select
                value={o.status}
                disabled={updatingId === o.id}
                onChange={(e) => handleStageChange(o.id, e.target.value)}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: 10,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: updatingId === o.id ? "not-allowed" : "pointer",
                  opacity: updatingId === o.id ? 0.6 : 1,
                }}
              >
                {TRACKING_STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>

              <Link
                to={`/orders/${o.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent)",
                  textDecoration: "none",
                  padding: "0.5rem 0.7rem",
                }}
              >
                Details <ChevronRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
