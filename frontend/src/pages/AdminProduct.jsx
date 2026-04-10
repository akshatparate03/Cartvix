import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = [
  "Shoes",
  "Shirts",
  "T-Shirts",
  "Caps",
  "Goggles",
  "Jewellery",
  "Jeans",
  "Pants",
  "Tops",
  "Froks",
  "Watches",
  "Bags",
  "Other",
];

const FormField = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-tertiary)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "var(--font-sans)",
      }}
    >
      {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
    </label>
    {children}
  </div>
);

export default function AdminProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      const p = res.data;
      const isStandardCat = CATEGORIES.slice(0, -1).includes(p.category);
      setForm({
        title: p.title,
        category: isStandardCat ? p.category : "Other",
        price: p.price,
        description: p.description,
        imageUrl: p.imageUrl,
      });
      if (!isStandardCat) setCustomCategory(p.category);
    } catch {
      toast.error("Product not found");
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory =
      form.category === "Other"
        ? customCategory.trim() || "Other"
        : form.category;

    if (!form.title || !form.category || !form.price || !form.imageUrl) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.category === "Other" && !customCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        category: finalCategory,
        price: parseFloat(form.price),
      };
      if (isEdit) {
        await axios.put(`/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated!");
      } else {
        await axios.post("/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added!");
      }
      navigate("/");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "var(--font-sans)",
  };

  return (
    <div
      style={{
        maxWidth: 580,
        margin: "0 auto",
        animation: "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 24,
          fontSize: 13,
          color: "var(--text-tertiary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--text-secondary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-tertiary)")
        }
      >
        <ArrowLeft size={14} /> Back
      </button>

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
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 22,
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <FormField label="Product Title" required>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Nike Air Max"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Category" required>
          <select
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
              if (e.target.value !== "Other") setCustomCategory("");
            }}
            style={inputStyle}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>

        {/* Custom category name when Other is selected */}
        {form.category === "Other" && (
          <FormField label="Category Name" required>
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Sunglasses, Scarves, Accessories..."
              style={inputStyle}
              autoFocus
            />
          </FormField>
        )}

        <FormField label="Price (INR)" required>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 1499"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Image URL" required>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            style={inputStyle}
          />
          {form.imageUrl && (
            <div
              style={{
                marginTop: 8,
                borderRadius: 14,
                overflow: "hidden",
                width: 100,
                height: 100,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <img
                src={form.imageUrl}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </FormField>

        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Product description..."
            style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="btn-glow"
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
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
          <Save size={16} />
          {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
