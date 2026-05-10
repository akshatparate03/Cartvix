import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, KeyRound, ArrowRight } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import cartvixLogo from "/Cartvix.png";

const InputField = ({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  extra,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Icon
        size={14}
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: focused ? "var(--accent)" : "var(--text-tertiary)",
          transition: "color 0.2s ease",
          zIndex: 1,
        }}
      />
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          paddingLeft: "2.5rem",
          paddingRight: extra ? "2.8rem" : "1rem",
          paddingTop: "0.7rem",
          paddingBottom: "0.7rem",
          fontSize: 14,
          borderRadius: 12,
          fontFamily: "var(--font-sans)",
        }}
      />
      {extra}
    </div>
  );
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.fullName}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--surface)",
      }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,54,33,0.06), rgba(13,13,15,1))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,54,33,0.12), transparent 70%)",
            filter: "blur(40px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,130,80,0.08), transparent 70%)",
            filter: "blur(60px)",
            animation: "float 6s ease-in-out infinite reverse",
          }}
        />

        <div className="relative z-10 text-center px-12">
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 26,
              overflow: "hidden",
              boxShadow:
                "0 0 60px rgba(255,54,33,0.4), 0 0 120px rgba(255,54,33,0.15)",
              margin: "0 auto 28px",
              animation: "float 6s ease-in-out infinite",
            }}
          >
            <img
              src={cartvixLogo}
              alt="Cartvix"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Welcome to
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff3621, #ff8060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cartvix
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 280,
              margin: "0 auto 40px",
            }}
          >
            Your premium shopping destination with AI-powered virtual try-on.
          </p>

          <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
            {[
              ["10K+", "Products"],
              ["50K+", "Users"],
              ["4.9", "Rating"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--text-primary)",
                  }}
                >
                  {val}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    marginTop: 2,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background:
              "linear-gradient(to top, rgba(13,13,15,0.3), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Mobile logo */}
          <div
            style={{ textAlign: "center", marginBottom: 32 }}
            className="lg:hidden"
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 0 30px rgba(255,54,33,0.3)",
                margin: "0 auto 16px",
              }}
            >
              <img
                src={cartvixLogo}
                alt="Cartvix"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Sign In
            </h1>
            <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>
              Welcome back! Enter your details below
            </p>
          </div>

          <div
            className="gradient-border"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "1.75rem",
              animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <InputField
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
              />
              <InputField
                icon={KeyRound}
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                extra={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-tertiary)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--text-secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-tertiary)")
                    }
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-glow"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4,
                  color: "white",
                }}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <GoogleAuthButton label="or sign in with Google" />

            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "var(--text-tertiary)",
                marginTop: 16,
              }}
            >
              No account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
