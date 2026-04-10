import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import cartvixLogo from "/Cartvix.png";

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const GlassInput = ({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  extra,
  monospace,
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
          pointerEvents: "none",
        }}
      />
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
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
          fontFamily: monospace ? "monospace" : "var(--font-sans)",
          letterSpacing: monospace ? "0.2em" : "normal",
        }}
      />
      {extra}
    </div>
  );
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    otp: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const navigate = useNavigate();

  const startTimer = () => {
    setOtpTimer(300);
    const t = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const sendOtp = async () => {
    if (!form.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!GMAIL_REGEX.test(form.email)) {
      toast.error("Only Gmail addresses are allowed.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/auth/send-otp", {
        email: form.email,
        fullName: form.fullName,
      });
      toast.success("OTP sent to your Gmail address.");
      setStep(2);
      startTimer();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!form.otp || form.otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      toast.success("OTP verified!");
      setStep(3);
    } catch (e) {
      toast.error(e.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        otp: form.otp,
      });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Details", "Verify", "Password"];

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
            top: "15%",
            right: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,54,33,0.1), transparent 70%)",
            filter: "blur(40px)",
            animation: "float 7s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.07), transparent 70%)",
            filter: "blur(50px)",
            animation: "float 5s ease-in-out infinite reverse",
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
            Join{" "}
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
            <br />
            Today
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
            Create your account in seconds and start shopping smarter.
          </p>
          <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
            {[
              ["10K+", "Products"],
              ["50K+", "Users"],
              ["4.9★", "Rating"],
            ].map(([val, label]) => (
              <div key={label}>
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
      </div>

      {/* Right form */}
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
              Create Account
            </h1>
            <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>
              Join Cartvix and start shopping
            </p>
          </div>

          {/* Progress steps */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            {steps.map((s, i) => {
              const stepNum = i + 1;
              const done = step > stepNum;
              const active = step === stepNum;
              return (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: i < steps.length - 1 ? 1 : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: done
                          ? "linear-gradient(135deg, #ff3621, #ff6b4a)"
                          : active
                            ? "rgba(255,54,33,0.15)"
                            : "rgba(255,255,255,0.04)",
                        border: active
                          ? "1px solid rgba(255,54,33,0.4)"
                          : done
                            ? "none"
                            : "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        boxShadow: active
                          ? "0 0 20px rgba(255,54,33,0.3)"
                          : "none",
                      }}
                    >
                      {done ? (
                        <Check size={14} style={{ color: "white" }} />
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: active
                              ? "var(--accent)"
                              : "var(--text-tertiary)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {stepNum}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: active
                          ? "var(--accent)"
                          : "var(--text-tertiary)",
                        marginTop: 4,
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background:
                          step > stepNum
                            ? "rgba(255,54,33,0.4)"
                            : "rgba(255,255,255,0.06)",
                        transition: "background 0.3s ease",
                        margin: "0 8px 14px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "1.75rem",
              animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Step 1: Name + Email */}
            {step === 1 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  Your Details
                </h2>
                <GlassInput
                  icon={User}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                />
                <GlassInput
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Gmail Address"
                />
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="btn-glow"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      Send OTP <ArrowRight size={15} />
                    </>
                  )}
                </button>
                <GoogleAuthButton label="or register with Google" />
              </div>
            )}

            {/* Step 2: OTP Verify */}
            {step === 2 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    Verify Email
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    We sent a code to{" "}
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                      }}
                    >
                      {form.email}
                    </span>
                  </p>
                </div>
                <GlassInput
                  icon={ShieldCheck}
                  value={form.otp}
                  onChange={(e) =>
                    setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="6-digit OTP"
                  maxLength={6}
                  monospace
                />
                {otpTimer > 0 && (
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    Expires in{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                      {fmt(otpTimer)}
                    </span>
                  </p>
                )}
                {otpTimer === 0 && (
                  <button
                    onClick={sendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "var(--accent)",
                      textAlign: "left",
                      padding: 0,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Resend OTP
                  </button>
                )}
                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="btn-glow"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify OTP <ArrowRight size={15} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  ← Change email
                </button>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    Set Password
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    Almost done! Create a secure password.
                  </p>
                </div>
                <GlassInput
                  icon={KeyRound}
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Password (min 6 chars)"
                  extra={
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
                <button
                  onClick={register}
                  disabled={loading}
                  className="btn-glow"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Account <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}

            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "var(--text-tertiary)",
                marginTop: 16,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
