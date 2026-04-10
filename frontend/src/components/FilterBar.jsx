import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useState } from "react";

export default function FilterBar({ onFilterChange, currentFilters }) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: showFilters
            ? "rgba(255,54,33,0.1)"
            : "rgba(255,255,255,0.04)",
          border: showFilters
            ? "1px solid rgba(255,54,33,0.2)"
            : "1px solid rgba(255,255,255,0.07)",
          color: showFilters ? "var(--accent)" : "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <SlidersHorizontal size={14} />
        Filters
        <ChevronDown
          size={13}
          style={{
            transition: "transform 0.2s ease",
            transform: showFilters ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      <select
        value={currentFilters.sort || "latest"}
        onChange={(e) =>
          onFilterChange({ ...currentFilters, sort: e.target.value })
        }
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 12,
          fontSize: 13,
          fontFamily: "var(--font-sans)",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {showFilters && (
        <div
          className="w-full flex items-center gap-4 flex-wrap p-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex items-center gap-3">
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-tertiary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Price:
            </label>
            <input
              type="number"
              placeholder="Min ₹"
              value={currentFilters.minPrice || ""}
              onChange={(e) =>
                onFilterChange({ ...currentFilters, minPrice: e.target.value })
              }
              style={{
                width: 96,
                padding: "6px 12px",
                borderRadius: 10,
                fontSize: 13,
              }}
            />
            <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>
              —
            </span>
            <input
              type="number"
              placeholder="Max ₹"
              value={currentFilters.maxPrice || ""}
              onChange={(e) =>
                onFilterChange({ ...currentFilters, maxPrice: e.target.value })
              }
              style={{
                width: 96,
                padding: "6px 12px",
                borderRadius: 10,
                fontSize: 13,
              }}
            />
          </div>

          <button
            onClick={() => onFilterChange({ sort: "latest" })}
            className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
            style={{ color: "var(--accent)", fontSize: 12 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <X size={12} /> Clear All
          </button>
        </div>
      )}
    </div>
  );
}
