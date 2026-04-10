import {
  Shield,
  Package,
  Zap,
  Users,
  Star,
  Award,
  TrendingUp,
  Globe,
} from "lucide-react";
import { useRef, useState } from "react";
import cartvixLogo from "/Cartvix.png";

const features = [
  {
    icon: Package,
    title: "Curated Products",
    desc: "Handpicked fashion and lifestyle products sourced from top brands and independent designers across India.",
    color: "#ff3621",
  },
  {
    icon: Star,
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns on all orders. Not happy? We make it simple to return or exchange any product.",
    color: "#a78bfa",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    desc: "Bank-grade 256-bit encryption across all transactions. Your data and payments are fully protected.",
    color: "#34d399",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized experience from browsing to checkout. Built for speed so you never miss a deal.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "50K+ Community",
    desc: "A thriving community of fashion-forward shoppers sharing reviews, styles, and recommendations.",
    color: "#06b6d4",
  },
  {
    icon: Globe,
    title: "Pan-India Delivery",
    desc: "Fast and reliable delivery to every corner of India with real-time tracking and easy returns.",
    color: "#ec4899",
  },
];

const stats = [
  { value: "10K+", label: "Products Listed", color: "#ff3621" },
  { value: "50K+", label: "Happy Customers", color: "#a78bfa" },
  { value: "4.9", label: "Average Rating", color: "#34d399" },
  { value: "99%", label: "Satisfaction Rate", color: "#f59e0b" },
];

function Feature3DCard({ f, i }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 20,
        padding: "1.75rem",
        textAlign: "center",
        transition:
          "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        willChange: "transform",
        animation: `slideUp 0.6s cubic-bezier(0.16,1,0.3,1)`,
        animationDelay: `${i * 0.08}s`,
        animationFillMode: "both",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = `${f.color}30`;
        e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}18, 0 0 40px ${f.color}10`;
      }}
      onMouseLeave={(e) => {
        setTilt({ x: 0, y: 0 });
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: `${f.color}12`,
          border: `1px solid ${f.color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
          transition: "all 0.3s ease",
          boxShadow: `0 0 20px ${f.color}10`,
        }}
      >
        <f.icon size={24} style={{ color: f.color }} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 17,
          color: "var(--text-primary)",
          marginBottom: 10,
        }}
      >
        {f.title}
      </h3>
      <p
        style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.7 }}
      >
        {f.desc}
      </p>
    </div>
  );
}

export default function About() {
  const [activeStat, setActiveStat] = useState(null);

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{
        animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
        paddingBottom: "5rem",
      }}
    >
      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 72,
          paddingTop: 24,
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,54,33,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            overflow: "hidden",
            margin: "0 auto 28px",
            boxShadow:
              "0 0 60px rgba(255,54,33,0.4), 0 0 120px rgba(255,54,33,0.15), 0 20px 60px rgba(0,0,0,0.5)",
            animation: "float 6s ease-in-out infinite",
            position: "relative",
            zIndex: 1,
          }}
        >
          <img
            src={cartvixLogo}
            alt="Cartvix"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,54,33,0.08)",
            border: "1px solid rgba(255,54,33,0.15)",
            color: "var(--accent)",
            fontSize: 11,
            fontWeight: 700,
            padding: "5px 14px",
            borderRadius: 8,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans)",
            marginBottom: 20,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Award size={11} /> Est. 2026 — Redefining Indian E-Commerce
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(36px, 7vw, 58px)",
            letterSpacing: "-0.04em",
            background:
              "linear-gradient(135deg, var(--text-primary) 0%, rgba(255,200,180,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
            lineHeight: 1.05,
            position: "relative",
            zIndex: 1,
          }}
        >
          About Cartvix
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          Redefining the way India shops online — with intelligence, speed, and
          style.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {stats.map((s, i) => (
          <div
            key={s.label}
            onMouseEnter={() => setActiveStat(i)}
            onMouseLeave={() => setActiveStat(null)}
            style={{
              background:
                activeStat === i ? `${s.color}0A` : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeStat === i ? s.color + "25" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 18,
              padding: "1.25rem",
              textAlign: "center",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              transform:
                activeStat === i ? "translateY(-6px) scale(1.04)" : "none",
              boxShadow:
                activeStat === i
                  ? `0 20px 50px rgba(0,0,0,0.35), 0 0 30px ${s.color}12`
                  : "none",
              cursor: "default",
              animation: `scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)`,
              animationDelay: `${i * 0.07}s`,
              animationFillMode: "both",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 32,
                color: s.color,
                lineHeight: 1,
                marginBottom: 6,
                filter:
                  activeStat === i
                    ? `drop-shadow(0 0 10px ${s.color}60)`
                    : "none",
                transition: "filter 0.3s ease",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-tertiary)",
                fontWeight: 500,
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {features.map((f, i) => (
          <Feature3DCard key={f.title} f={f} i={i} />
        ))}
      </div>

      {/* Mission section */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 28,
          padding: "2.5rem",
          position: "relative",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,54,33,0.06), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div
            style={{
              width: 3,
              height: 22,
              borderRadius: 2,
              background: "linear-gradient(180deg, #ff3621, #ff8060)",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Our Mission
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            "Cartvix is a next-generation e-commerce platform built with passion to bring the best shopping experience to every Indian household. We combine cutting-edge AI technology with a seamless user experience to make fashion accessible, intelligent, and fun.",
            "We are obsessed with making the shopping experience as smooth as possible — from browsing to checkout to delivery. Every feature we build is designed to save your time and help you discover fashion that truly matches your style.",
            "Founded in 2026 and headquartered in India, Cartvix is built by a passionate team of engineers, designers, and fashion enthusiasts who believe the future of shopping is personal, predictive, and delightful. We are just getting started.",
          ].map((text, i) => (
            <p
              key={i}
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.85,
                paddingLeft: 16,
                borderLeft: "2px solid rgba(255,54,33,0.12)",
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255,54,33,0.08) 0%, rgba(255,130,80,0.04) 100%)",
          border: "1px solid rgba(255,54,33,0.15)",
          borderRadius: 20,
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,54,33,0.1), transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-primary)",
            }}
          >
            Ready to experience the future of shopping?
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            Join over 50,000 happy customers on Cartvix.
          </p>
        </div>
        <a
          href="/"
          className="btn-glow"
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "white",
            position: "relative",
            zIndex: 1,
          }}
        >
          <TrendingUp size={15} />
          Start Shopping
        </a>
      </div>
    </div>
  );
}
