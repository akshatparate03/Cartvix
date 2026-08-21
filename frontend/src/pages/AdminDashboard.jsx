import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  Store,
  UserCircle,
  ClipboardList,
  Plus,
  TrendingUp,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { TRACKING_STAGES } from "../components/OrderTracker";

// FEATURE: Master Admin Dashboard — the single command-center page for the
// super-admin. Pulls aggregated platform stats from GET /api/admin/dashboard
// (orders, revenue, products, users, sellers) and lays them out as KPI
// cards + breakdown panels + recent-activity feeds, with quick links into
// the existing admin tools (Manage Orders, Add Product, etc.) so nothing
// about those pages changes — this is purely a new overview on top.
export default function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchDashboard();
  }, [isAdmin]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "1.5rem",
  };

  const stageLabel = (key) =>
    TRACKING_STAGES.find((s) => s.key === key)?.label || key;

  return (
    <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
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
            Admin Panel
          </span>
        </div>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          <LayoutDashboard size={26} style={{ color: "var(--accent)" }} />
          Master Dashboard
        </h1>
        <p
          style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}
        >
          Full overview of orders, products, sellers, and customers on Cartvix.
        </p>
      </div>

      {loading && (
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
      )}

      {!loading && data && (
        <>
          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                icon: IndianRupee,
                label: "Total Revenue",
                value: `₹${data.totalRevenue?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                sub: `Avg order ₹${data.avgOrderValue?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                color: "#ff3621",
              },
              {
                icon: ShoppingBag,
                label: "Total Orders",
                value: data.totalOrders,
                sub: `${data.ordersByStage?.DELIVERED || 0} delivered`,
                color: "#34d399",
              },
              {
                icon: Package,
                label: "Total Products",
                value: data.totalProducts,
                sub: `${data.sellerProducts} by sellers`,
                color: "#60a5fa",
              },
              {
                icon: Users,
                label: "Total Users",
                value: data.totalUsers,
                sub: `${data.totalSellers} sellers · ${data.totalCustomers} customers`,
                color: "#a78bfa",
              },
            ].map((kpi) => (
              <div key={kpi.label} style={cardStyle}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${kpi.color}15`,
                    border: `1px solid ${kpi.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <kpi.icon size={18} style={{ color: kpi.color }} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 24,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: 2,
                  }}
                >
                  {kpi.value}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    fontWeight: 600,
                  }}
                >
                  {kpi.label}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    marginTop: 6,
                  }}
                >
                  {kpi.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── Quick actions ── */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {[
              {
                to: "/admin/orders",
                icon: ClipboardList,
                label: "Manage Orders",
              },
              { to: "/admin/add-product", icon: Plus, label: "Add Product" },
              { to: "/seller/my-products", icon: Store, label: "All Listings" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.6rem 1.1rem",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,54,33,0.08)",
                  border: "1px solid rgba(255,54,33,0.18)",
                  color: "var(--accent)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,54,33,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,54,33,0.08)";
                }}
              >
                <action.icon size={14} /> {action.label}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ── Orders by stage ── */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-primary)",
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TrendingUp size={16} style={{ color: "var(--accent)" }} />
                Orders by Stage
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {TRACKING_STAGES.map((stage) => {
                  const count = data.ordersByStage?.[stage.key] || 0;
                  const pct =
                    data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0;
                  return (
                    <div key={stage.key}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {stage.label}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 4,
                          background: "rgba(255,255,255,0.06)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            borderRadius: 4,
                            background:
                              "linear-gradient(90deg, #ff3621, #ff8060)",
                            transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Products by category ── */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-primary)",
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Package size={16} style={{ color: "var(--accent)" }} />
                Products by Category
              </h2>
              {Object.keys(data.productsByCategory || {}).length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                  No products listed yet.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {Object.entries(data.productsByCategory).map(
                    ([cat, count]) => {
                      const pct =
                        data.totalProducts > 0
                          ? (count / data.totalProducts) * 100
                          : 0;
                      return (
                        <div key={cat}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {cat}
                            </span>
                            <span
                              style={{
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {count}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 6,
                              borderRadius: 4,
                              background: "rgba(255,255,255,0.06)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                borderRadius: 4,
                                background:
                                  "linear-gradient(90deg, #60a5fa, #a78bfa)",
                                transition:
                                  "width 0.5s cubic-bezier(0.16,1,0.3,1)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {/* ── Recent orders ── */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ShoppingBag size={16} style={{ color: "var(--accent)" }} />
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--accent)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  View all <ChevronRight size={12} />
                </Link>
              </div>

              {data.recentOrders?.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                  No orders placed yet.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {data.recentOrders?.map((o) => (
                    <Link
                      key={o.id}
                      to={`/orders/${o.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.6rem 0.8rem",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.02)",
                        textDecoration: "none",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                          className="line-clamp-1"
                        >
                          #{o.id} — {o.fullName}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {stageLabel(o.status)}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--accent)",
                          fontFamily: "var(--font-display)",
                          flexShrink: 0,
                        }}
                      >
                        ₹{o.totalAmount?.toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── Recent users ── */}
            <div style={cardStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <UserCircle size={16} style={{ color: "var(--accent)" }} />
                Recent Signups
              </h2>

              {data.recentUsers?.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                  No users yet.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {data.recentUsers?.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "0.5rem 0.4rem",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(255,54,33,0.1)",
                          border: "1px solid rgba(255,54,33,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent)",
                          flexShrink: 0,
                        }}
                      >
                        {u.fullName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                          className="line-clamp-1"
                        >
                          {u.fullName}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-tertiary)",
                          }}
                          className="line-clamp-1"
                        >
                          {u.email}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 100,
                          background:
                            u.role === "SELLER"
                              ? "rgba(96,165,250,0.12)"
                              : "rgba(255,255,255,0.06)",
                          color:
                            u.role === "SELLER"
                              ? "#60a5fa"
                              : "var(--text-tertiary)",
                          flexShrink: 0,
                        }}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Top sellers ── */}
          {data.topSellers?.length > 0 && (
            <div style={{ ...cardStyle, marginTop: 20 }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Store size={16} style={{ color: "var(--accent)" }} />
                Top Sellers by Listings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {data.topSellers.map((s, i) => (
                  <div
                    key={s.sellerId}
                    style={{
                      padding: "0.9rem",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        #{i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        {s.productCount} products
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                      className="line-clamp-1"
                    >
                      {s.sellerName}
                    </p>
                    <p
                      style={{ fontSize: 11, color: "var(--text-tertiary)" }}
                      className="line-clamp-1"
                    >
                      {s.sellerEmail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
