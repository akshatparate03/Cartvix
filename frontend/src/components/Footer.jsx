import { Link } from "react-router-dom";
import cartvixLogo from "/Cartvix.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-20 relative overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(13,13,15,0) 0%, rgba(10,10,12,0.95) 100%)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,54,33,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  overflow: "hidden",
                  boxShadow: "0 0 20px rgba(255,54,33,0.3)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(255,54,33,0.5)";
                  e.currentTarget.style.transform = "scale(1.08) rotate(-3deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(255,54,33,0.3)";
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                }}
              >
                <img
                  src={cartvixLogo}
                  alt="Cartvix"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: "-0.04em",
                  background:
                    "linear-gradient(135deg, var(--text-primary), rgba(255,180,160,0.8))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Cartvix
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                maxWidth: 220,
              }}
            >
              Next-generation fashion shopping. Premium products, delivered fast
              across India.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Navigate
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/cart", label: "Cart" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontSize: 13,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Platform
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["10K+ Products", "Curated collections"],
                ["50K+ Users", "Happy shoppers"],
                ["Easy Returns", "7-day policy"],
              ].map(([title, sub]) => (
                <div
                  key={title}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {title}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(255,54,33,0.15), rgba(255,255,255,0.06), transparent)",
            marginBottom: 20,
          }}
        />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            © {year} Cartvix. All Rights Reserved.
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Made with care by the Cartvix Team
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 8px rgba(255,54,33,0.6)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
