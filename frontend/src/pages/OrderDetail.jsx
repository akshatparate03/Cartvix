import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Clock,
  ShieldCheck,
} from "lucide-react";
import OrderTracker, { TRACKING_STAGES } from "../components/OrderTracker";

// FEATURE: shows the full straight-line tracking timeline for one order.
// A regular customer sees this read-only. The admin sees an extra control
// to manually move the order to the next stage.
export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [id, user]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
      setSelectedStage(res.data.status);
    } catch (e) {
      toast.error(e.response?.data?.message || "Order not found");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedStage === order.status) return;
    setUpdating(true);
    try {
      const res = await axios.put(
        `/orders/${id}/status`,
        { status: selectedStage },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrder(res.data);
      toast.success(`Order marked as ${selectedStage.replace(/_/g, " ")}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
      setSelectedStage(order.status);
    } finally {
      setUpdating(false);
    }
  };

  let history = [];
  try {
    history = order?.trackingHistory ? JSON.parse(order.trackingHistory) : [];
  } catch {
    history = [];
  }

  if (loading) {
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
  }

  if (!order) return null;

  const sectionStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "1.5rem",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/orders")}
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
        }}
      >
        <ArrowLeft size={14} /> Back to Orders
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Order #{order.id}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            Placed on{" "}
            {order.createdAt &&
              new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
          </p>
        </div>
        {isAdmin && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 100,
              background: "rgba(255,54,33,0.1)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <ShieldCheck size={12} /> ADMIN VIEW
          </span>
        )}
      </div>

      {/* Tracking stepper */}
      <div style={{ ...sectionStyle, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 17,
              color: "var(--text-primary)",
            }}
          >
            Tracking Status
          </h2>
          {order.statusUpdatedAt && (
            <span
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={11} />
              Updated{" "}
              {new Date(order.statusUpdatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <OrderTracker status={order.status} />

        {/* Admin-only manual status control */}
        {isAdmin && (
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Update Stage:
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
              }}
            >
              {TRACKING_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStage === order.status}
              className="btn-glow"
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor:
                  updating || selectedStage === order.status
                    ? "not-allowed"
                    : "pointer",
                opacity: updating || selectedStage === order.status ? 0.5 : 1,
                color: "white",
              }}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        )}
      </div>

      {/* Timeline log */}
      {history.length > 0 && (
        <div style={{ ...sectionStyle, marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 17,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            Timeline
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {history
              .slice()
              .reverse()
              .map((h, i) => {
                const stage = TRACKING_STAGES.find((s) => s.key === h.status);
                return (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          i === 0 ? "var(--accent)" : "var(--text-tertiary)",
                        boxShadow:
                          i === 0 ? "0 0 8px rgba(255,54,33,0.6)" : "none",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: i === 0 ? 700 : 500,
                        color:
                          i === 0
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {stage?.label || h.status}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                        marginLeft: "auto",
                      }}
                    >
                      {h.timestamp &&
                        new Date(h.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Shipping + payment info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div style={sectionStyle}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            <MapPin size={14} style={{ color: "var(--accent)" }} /> Shipping To
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            {order.fullName}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              marginTop: 2,
            }}
          >
            {order.phone}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            {order.shippingAddress}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            <CreditCard size={14} style={{ color: "var(--accent)" }} /> Payment
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {order.paymentMethod}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              marginTop: 8,
              background: "linear-gradient(135deg, #ff3621, #ff8060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{order.totalAmount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
