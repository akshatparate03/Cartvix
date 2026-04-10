import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import axios from "../utils/axios";
import { Package, TrendingUp, Zap } from "lucide-react";

export default function Home({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: "latest" });
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, filters]);

  const handleHeroMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      const res = await axios.get(`/products?${params}`);
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const isHome = !selectedCategory || selectedCategory === "all";

  return (
    <div
      className="space-y-8"
      style={{ animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
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
                fontFamily: "var(--font-sans)",
              }}
            >
              {isHome ? "All Collections" : "Category"}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, var(--text-primary) 0%, rgba(255,200,180,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isHome ? "All Products" : selectedCategory}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            {loading ? "..." : `${products.length} products`}
          </p>
        </div>
        <FilterBar onFilterChange={setFilters} currentFilters={filters} />
      </div>

      {/* Hero Banner - Heavy 3D Animated */}
      {isHome && (
        <div
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,10,8,1) 0%, rgba(13,13,15,1) 100%)",
            border: "1px solid rgba(255,54,33,0.18)",
            padding: "3rem 2.5rem",
            minHeight: 240,
            cursor: "default",
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Dynamic spotlight following mouse */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 60% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(255,54,33,0.15) 0%, transparent 70%)`,
              transition: "background 0.1s ease",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Animated floating orbs */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,54,33,0.18), transparent 70%)",
              filter: "blur(30px)",
              animation: "float 7s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: "20%",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,100,60,0.12), transparent 70%)",
              filter: "blur(40px)",
              animation: "float 5s ease-in-out infinite reverse",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: "25%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,150,80,0.1), transparent 70%)",
              filter: "blur(20px)",
              animation: "float 9s ease-in-out infinite 1s",
              pointerEvents: "none",
            }}
          />

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Diagonal accent lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(255,54,33,0.015) 80px, rgba(255,54,33,0.015) 81px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* 3D floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 2 === 0 ? 6 : 4,
                height: i % 2 === 0 ? 6 : 4,
                borderRadius: "50%",
                background: `rgba(255,54,33,${0.3 + i * 0.05})`,
                boxShadow: `0 0 ${8 + i * 3}px rgba(255,54,33,0.4)`,
                top: `${15 + i * 13}%`,
                right: `${8 + i * 6}%`,
                animation: `float ${4 + i}s ease-in-out infinite ${i * 0.4}s`,
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          ))}

          {/* Rotating ring decoration */}
          <div
            style={{
              position: "absolute",
              right: "5%",
              top: "50%",
              transform: "translateY(-50%)",
              width: 160,
              height: 160,
              borderRadius: "50%",
              border: "1px solid rgba(255,54,33,0.12)",
              animation: "spin3d 20s linear infinite",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "7%",
              top: "50%",
              transform: "translateY(-50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "1px dashed rgba(255,54,33,0.08)",
              animation: "spin3d 15s linear infinite reverse",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,54,33,0.12)",
                  border: "1px solid rgba(255,54,33,0.25)",
                  color: "var(--accent)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 12px",
                  borderRadius: 8,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  boxShadow: "0 0 16px rgba(255,54,33,0.15)",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              >
                <TrendingUp size={11} /> Hot Deals
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.15)",
                  color: "#a78bfa",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 8,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Zap size={10} /> AI Powered
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(26px, 5vw, 50px)",
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1.05,
                marginBottom: 16,
                animation: "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both",
              }}
            >
              Shop the Latest
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ff3621 0%, #ff8060 50%, #ff3621 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 3s linear infinite",
                }}
              >
                Trends
              </span>
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 7,
                animation: "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              }}
            >
              <Zap
                size={14}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              Discover premium fashion for every style
            </p>

            {/* Animated stats bar */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 24,
                animation: "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both",
              }}
            >
              {[
                ["10K+", "Products"],
                ["50K+", "Users"],
                ["4.9", "Rating"],
              ].map(([val, label], i) => (
                <div
                  key={label}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,54,33,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,54,33,0.2)";
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.04)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 18,
                      color: "var(--text-primary)",
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--text-tertiary)",
                      marginTop: 1,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative text */}
          <div
            style={{
              position: "absolute",
              right: "2rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "clamp(60px, 10vw, 110px)",
              opacity: 0.025,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.06em",
              userSelect: "none",
              pointerEvents: "none",
              animation: "float 8s ease-in-out infinite",
              zIndex: 1,
            }}
          >
            NEW
          </div>

          <style>{`
            @keyframes spin3d {
              from { transform: translateY(-50%) rotate(0deg); }
              to { transform: translateY(-50%) rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                animation: `pulse 2s cubic-bezier(0.4,0,0.6,1) infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
              <div className="p-4 space-y-2">
                <div
                  style={{
                    height: 12,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    width: "70%",
                  }}
                />
                <div
                  style={{
                    height: 10,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 6,
                    width: "50%",
                  }}
                />
                <div
                  style={{
                    height: 32,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div
              key={p.id}
              style={{
                animation: `fadeIn 0.5s cubic-bezier(0.16,1,0.3,1)`,
                animationDelay: `${i * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: "rgba(255,54,33,0.08)",
              border: "1px solid rgba(255,54,33,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Package size={36} style={{ color: "rgba(255,54,33,0.4)" }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--text-secondary)",
            }}
          >
            No products found
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 8,
            }}
          >
            Try changing your filters or category
          </p>
        </div>
      )}
    </div>
  );
}
