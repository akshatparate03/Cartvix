import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, User, KeyRound, ShieldCheck } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

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
      toast.success("OTP verified! Set your password.");
      setStep(3);
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Invalid OTP. Please try again.",
      );
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

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Logo + heading — compact */}
        <div className="text-center mb-5 animate-fade-in">
          <div className="w-11 h-11 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
            <span className="text-white font-display font-bold text-xl">C</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-500 mt-1 text-xs">
            Join Cartvix and start shopping
          </p>
        </div>

        {/* Progress — compact */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${
                  step > s
                    ? "bg-orange-500 text-white"
                    : step === s
                      ? "bg-orange-500 text-white ring-4 ring-orange-100"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-8 h-0.5 rounded ${step > s ? "bg-orange-400" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Single card — tighter padding */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 px-7 py-6 animate-slide-up">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg text-gray-800">
                Your Details
              </h2>

              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm transition-all"
                />
              </div>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm transition-all"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-60 text-sm"
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>

              <GoogleAuthButton label="or register with Google instead" />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg text-gray-800">
                Verify Email
              </h2>
              <p className="text-xs text-gray-500">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-gray-700">
                  {form.email}
                </span>
              </p>

              <div className="relative">
                <ShieldCheck
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={form.otp}
                  onChange={(e) =>
                    setForm({ ...form, otp: e.target.value.replace(/\D/, "") })
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm transition-all tracking-widest font-mono"
                />
              </div>

              {otpTimer > 0 && (
                <p className="text-xs text-gray-400">
                  Expires in{" "}
                  <span className="text-orange-500 font-semibold">
                    {fmt(otpTimer)}
                  </span>
                </p>
              )}
              {otpTimer === 0 && (
                <button
                  onClick={sendOtp}
                  className="text-xs text-orange-500 hover:underline"
                >
                  Resend OTP
                </button>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-60 text-sm"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-xs text-gray-500 hover:text-gray-700 pt-1"
              >
                ← Change email
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg text-gray-800">
                Set Password
              </h2>
              <p className="text-xs text-gray-500">
                Almost done! Create a secure password.
              </p>

              <div className="relative">
                <KeyRound
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type={showPass ? "text" : "password"}
                  placeholder="Password (min 6 chars)"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={register}
                disabled={loading}
                className="w-full py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-60 text-sm"
              >
                {loading ? "Creating Account..." : "Create Account 🎉"}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
