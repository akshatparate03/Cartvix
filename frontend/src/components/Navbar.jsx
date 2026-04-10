import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogOut, Plus, X, Menu, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import cartvixLogo from "/Cartvix.png";

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchResults([]);
      if (dropRef.current && !dropRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(
        `/products/search?q=${encodeURIComponent(q)}`,
      );
      setSearchResults(res.data.slice(0, 6));
    } catch {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(13,13,15,0.92)" : "rgba(13,13,15,0.7)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(255,255,255,0.03)",
        boxShadow: scrolled
          ? "0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,54,33,0.03)"
          : "none",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1.5px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,54,33,0.8) 30%, rgba(255,130,80,0.6) 60%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl transition-all duration-200 lg:hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Menu size={18} style={{ color: "var(--text-secondary)" }} />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 0 20px rgba(255,54,33,0.35)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
              className="group-hover:scale-105"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 32px rgba(255,54,33,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,54,33,0.35)";
              }}
            >
              <img
                src={cartvixLogo}
                alt="Cartvix"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span
              className="font-display font-bold text-xl hidden sm:block"
              style={{
                background:
                  "linear-gradient(135deg, var(--text-primary), rgba(255,200,180,0.85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
              }}
            >
              Cartvix
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-auto relative" ref={searchRef}>
          <div className="relative group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
              style={{ color: "var(--text-tertiary)" }}
            />
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products, categories..."
              style={{
                width: "100%",
                paddingLeft: "2.5rem",
                paddingRight: searchQuery ? "2.5rem" : "1rem",
                paddingTop: "0.6rem",
                paddingBottom: "0.6rem",
                fontSize: 14,
                borderRadius: 12,
                fontFamily: "var(--font-sans)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                style={{ color: "var(--text-tertiary)" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div
              className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50"
              style={{
                background: "rgba(20,20,22,0.97)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {searchResults.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200"
                  style={{
                    borderBottom:
                      i < searchResults.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,54,33,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--accent)",
                        fontWeight: 600,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {p.price?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div
                    className="ml-auto"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Zap size={12} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="hidden md:flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin/add-product"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,54,33,0.1)",
                color: "var(--accent)",
                border: "1px solid rgba(255,54,33,0.2)",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,54,33,0.18)";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,54,33,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,54,33,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Plus size={13} /> Add
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,54,33,0.25)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(255,54,33,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <ShoppingCart size={18} style={{ color: "var(--text-primary)" }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
                style={{
                  background: "linear-gradient(135deg, #ff3621, #ff6b4a)",
                  color: "white",
                  fontSize: 10,
                  boxShadow: "0 0 12px rgba(255,54,33,0.6)",
                  animation: "glowPulse 2s ease-in-out infinite",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #ff3621, #ff8060)",
                  color: "white",
                  boxShadow: showDropdown
                    ? "0 0 24px rgba(255,54,33,0.55)"
                    : "0 0 0 rgba(255,54,33,0)",
                  fontFamily: "var(--font-display)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {user.fullName?.charAt(0).toUpperCase()}
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(18,18,20,0.98)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05)",
                    animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <div
                    className="px-4 py-3.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {user.fullName}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-tertiary)",
                        marginTop: 2,
                      }}
                      className="truncate"
                    >
                      {user.email}
                    </p>
                    {isAdmin && (
                      <span
                        className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(255,54,33,0.12)",
                          color: "var(--accent)",
                          fontSize: 10,
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin/add-product"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm transition-all duration-200"
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,54,33,0.06)";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      <Plus size={14} /> Add Product
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all duration-200"
                    style={{ color: "#ff6b6b", fontFamily: "var(--font-sans)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,107,107,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 btn-glow"
              style={{
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.01em",
                color: "white",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
