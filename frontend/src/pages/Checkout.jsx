import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Loader,
  ShoppingBag,
} from "lucide-react";

const inputStyle = {
  width: "100%",
  padding: "0.7rem 1rem",
  borderRadius: 12,
  fontSize: 14,
  fontFamily: "var(--font-sans)",
};

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [address, setAddress] = useState({
    fullName: user?.fullName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    bank: "",
    accountNumber: "",
  });

  const total = cartItems.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0,
  );

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
          );
          const data = await res.json();
          const ad = data.address;
          setAddress((prev) => ({
            ...prev,
            address: [ad.road, ad.suburb, ad.neighbourhood]
              .filter(Boolean)
              .join(", "),
            city: ad.city || ad.town || ad.village || "",
            state: ad.state || "",
            pincode: ad.postcode || "",
          }));
          toast.success("Location detected!");
        } catch {
          toast.error("Could not fetch address");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Location access denied");
        setLocating(false);
      },
    );
  };

  const placeOrder = async () => {
    const required = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    for (const f of required)
      if (!address[f]) {
        toast.error(`Please fill ${f}`);
        return;
      }

    // Capture total BEFORE clearing cart
    const capturedTotal = total;
    setOrderTotal(capturedTotal);

    setLoading(true);
    try {
      await axios.post(
        "/orders/place",
        {
          shippingAddress: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
          fullName: address.fullName,
          phone: address.phone,
          paymentMethod: payMethod,
          totalAmount: capturedTotal,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await clearCart();
      setSuccess(true);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (success)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1rem",
          textAlign: "center",
          animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Animated success ring */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: "1px solid rgba(52,211,153,0.15)",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              animation: "rippleOut 2s ease-out infinite",
            }}
          />
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 50px rgba(52,211,153,0.2), 0 0 100px rgba(52,211,153,0.08)",
            }}
          >
            <CheckCircle2 size={48} style={{ color: "#34d399" }} />
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 34,
            color: "var(--text-primary)",
            marginBottom: 8,
            letterSpacing: "-0.03em",
          }}
        >
          Order Placed!
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 15,
            marginBottom: 6,
          }}
        >
          Your order has been placed successfully.
        </p>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-tertiary)",
            marginBottom: 32,
          }}
        >
          Total:{" "}
          <span
            style={{
              fontWeight: 800,
              color: "var(--accent)",
              fontFamily: "var(--font-display)",
            }}
          >
            {orderTotal.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </span>
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-glow"
          style={{
            padding: "0.75rem 2.5rem",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ShoppingBag size={15} /> Continue Shopping
        </button>

        <style>{`
          @keyframes rippleOut {
            0% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
            100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
          }
        `}</style>
      </div>
    );

  const sectionStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "1.5rem",
  };

  const payMethods = [
    { id: "card", icon: <CreditCard size={16} />, label: "Card" },
    { id: "upi", icon: <Smartphone size={16} />, label: "UPI" },
    { id: "netbanking", icon: <Building2 size={16} />, label: "Net Banking" },
  ];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
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
            Secure Checkout
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
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Address */}
          <div style={sectionStyle}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              <MapPin size={16} style={{ color: "var(--accent)" }} /> Shipping
              Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["fullName", "Full Name"],
                ["phone", "Phone Number"],
              ].map(([k, l]) => (
                <input
                  key={k}
                  placeholder={l}
                  value={address[k]}
                  onChange={(e) =>
                    setAddress({ ...address, [k]: e.target.value })
                  }
                  style={inputStyle}
                />
              ))}
              <div style={{ gridColumn: "1 / -1", position: "relative" }}>
                <input
                  placeholder="Address"
                  value={address.address}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                  style={{ ...inputStyle, paddingRight: "8rem" }}
                />
                <button
                  onClick={detectLocation}
                  disabled={locating}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "rgba(255,54,33,0.1)",
                    border: "1px solid rgba(255,54,33,0.15)",
                    color: "var(--accent)",
                    cursor: locating ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {locating ? (
                    <Loader
                      size={11}
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                  ) : (
                    <MapPin size={11} />
                  )}
                  {locating ? "Locating..." : "Detect"}
                </button>
              </div>
              {[
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([k, l]) => (
                <input
                  key={k}
                  placeholder={l}
                  value={address[k]}
                  onChange={(e) =>
                    setAddress({ ...address, [k]: e.target.value })
                  }
                  style={inputStyle}
                />
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={sectionStyle}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Payment Method
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginBottom: 18,
              }}
            >
              {payMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "0.875rem",
                    borderRadius: 14,
                    background:
                      payMethod === m.id
                        ? "rgba(255,54,33,0.1)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      payMethod === m.id
                        ? "1px solid rgba(255,54,33,0.25)"
                        : "1px solid rgba(255,255,255,0.07)",
                    color:
                      payMethod === m.id
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.2s ease",
                    boxShadow:
                      payMethod === m.id
                        ? "0 0 16px rgba(255,54,33,0.15)"
                        : "none",
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <div
              style={{
                animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {payMethod === "card" && (
                <>
                  <input
                    placeholder="Card Number (1234 5678 9012 3456)"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment({ ...payment, cardNumber: e.target.value })
                    }
                    maxLength={19}
                    style={inputStyle}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <input
                      placeholder="MM/YY"
                      value={payment.expiry}
                      onChange={(e) =>
                        setPayment({ ...payment, expiry: e.target.value })
                      }
                      maxLength={5}
                      style={inputStyle}
                    />
                    <input
                      placeholder="CVV"
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment({ ...payment, cvv: e.target.value })
                      }
                      maxLength={3}
                      type="password"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}
              {payMethod === "upi" && (
                <input
                  placeholder="UPI ID (e.g. name@upi)"
                  value={payment.upiId}
                  onChange={(e) =>
                    setPayment({ ...payment, upiId: e.target.value })
                  }
                  style={inputStyle}
                />
              )}
              {payMethod === "netbanking" && (
                <>
                  <select
                    value={payment.bank}
                    onChange={(e) =>
                      setPayment({ ...payment, bank: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Bank</option>
                    {[
                      "SBI",
                      "HDFC",
                      "ICICI",
                      "Axis Bank",
                      "Kotak",
                      "PNB",
                      "Yes Bank",
                    ].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Account Number"
                    value={payment.accountNumber}
                    onChange={(e) =>
                      setPayment({ ...payment, accountNumber: e.target.value })
                    }
                    style={inputStyle}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div style={{ ...sectionStyle, position: "sticky", top: 88 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Order Summary
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 16,
                maxHeight: 180,
                overflowY: "auto",
              }}
              className="scrollbar-hide"
            >
              {cartItems.map((i) => (
                <div
                  key={i.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-tertiary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: 8,
                      maxWidth: "60%",
                    }}
                  >
                    {i.product?.title} ×{i.quantity}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                    }}
                  >
                    {((i.product?.price || 0) * i.quantity).toLocaleString(
                      "en-IN",
                      {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-tertiary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {total.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-tertiary)" }}>Delivery</span>
                <span style={{ color: "#34d399", fontWeight: 600 }}>FREE</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-primary)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 18,
                    background: "linear-gradient(135deg, #ff3621, #ff8060)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {total.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading || cartItems.length === 0}
              className="btn-glow"
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor:
                  loading || cartItems.length === 0 ? "not-allowed" : "pointer",
                opacity: loading || cartItems.length === 0 ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "white",
              }}
            >
              {loading ? (
                <>
                  <Loader
                    size={16}
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />{" "}
                  Placing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
