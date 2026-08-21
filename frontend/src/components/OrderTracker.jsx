import { Check, PackageCheck, PackageSearch, Truck, Home } from "lucide-react";

// FEATURE: fixed tracking stages — MUST match OrderService.TRACKING_STAGES
// on the backend exactly (same strings, same order).
export const TRACKING_STAGES = [
  { key: "PLACED", label: "Order Placed", icon: PackageSearch },
  { key: "CONFIRMED", label: "Confirmed", icon: Check },
  { key: "PACKED", label: "Packed", icon: PackageCheck },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

/**
 * OrderTracker — a straight-line stepper showing which stage the order is
 * currently at. Completed stages get a filled circle with a checkmark,
 * the current stage pulses, and future stages stay greyed out. Works on
 * both desktop (horizontal line) and mobile (wraps to a vertical line).
 *
 * Props:
 *   status — current order status string (e.g. "SHIPPED")
 */
export default function OrderTracker({ status }) {
  const currentIndex = TRACKING_STAGES.findIndex((s) => s.key === status);
  // Fallback: unknown/legacy status → treat as just-placed so UI never breaks
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const progressFraction =
    TRACKING_STAGES.length > 1 ? activeIndex / (TRACKING_STAGES.length - 1) : 0;

  return (
    <div style={{ width: "100%", padding: "0.5rem 0" }}>
      {/* ── Desktop / tablet: horizontal straight line ── */}
      <div
        className="hidden sm:block"
        style={{ position: "relative", padding: "0 8px" }}
      >
        {/* Background track */}
        <div
          style={{
            position: "absolute",
            top: 19,
            left: 24,
            right: 24,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        {/* Filled (completed) portion of the line */}
        <div
          style={{
            position: "absolute",
            top: 19,
            left: 24,
            height: 3,
            borderRadius: 2,
            width: `calc((100% - 48px) * ${progressFraction})`,
            background: "linear-gradient(90deg, #ff3621, #ff8060)",
            boxShadow: "0 0 12px rgba(255,54,33,0.5)",
            transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {TRACKING_STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const done = i < activeIndex;
            const current = i === activeIndex;
            return (
              <div
                key={stage.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done
                      ? "linear-gradient(135deg, #ff3621, #ff6b4a)"
                      : current
                        ? "rgba(255,54,33,0.15)"
                        : "rgba(255,255,255,0.05)",
                    border: current
                      ? "2px solid var(--accent)"
                      : done
                        ? "2px solid transparent"
                        : "2px solid rgba(255,255,255,0.1)",
                    boxShadow: done
                      ? "0 0 20px rgba(255,54,33,0.4)"
                      : current
                        ? "0 0 16px rgba(255,54,33,0.25)"
                        : "none",
                    animation: current
                      ? "glowPulse 2s ease-in-out infinite"
                      : "none",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {done ? (
                    <Check size={18} color="white" strokeWidth={3} />
                  ) : (
                    <Icon
                      size={16}
                      style={{
                        color: current
                          ? "var(--accent)"
                          : "var(--text-tertiary)",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: current ? 700 : 600,
                    textAlign: "center",
                    color: done
                      ? "var(--text-secondary)"
                      : current
                        ? "var(--accent)"
                        : "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                    maxWidth: 78,
                    lineHeight: 1.3,
                  }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: vertical straight line ── */}
      <div
        className="sm:hidden"
        style={{ position: "relative", paddingLeft: 8 }}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            bottom: 20,
            left: 27,
            width: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 27,
            width: 3,
            borderRadius: 2,
            height: `calc((100% - 40px) * ${progressFraction})`,
            background: "linear-gradient(180deg, #ff3621, #ff8060)",
            boxShadow: "0 0 12px rgba(255,54,33,0.5)",
            transition: "height 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TRACKING_STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const done = i < activeIndex;
            const current = i === activeIndex;
            return (
              <div
                key={stage.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done
                      ? "linear-gradient(135deg, #ff3621, #ff6b4a)"
                      : current
                        ? "rgba(255,54,33,0.15)"
                        : "rgba(255,255,255,0.05)",
                    border: current
                      ? "2px solid var(--accent)"
                      : done
                        ? "2px solid transparent"
                        : "2px solid rgba(255,255,255,0.1)",
                    boxShadow: done
                      ? "0 0 20px rgba(255,54,33,0.4)"
                      : current
                        ? "0 0 16px rgba(255,54,33,0.25)"
                        : "none",
                    animation: current
                      ? "glowPulse 2s ease-in-out infinite"
                      : "none",
                  }}
                >
                  {done ? (
                    <Check size={18} color="white" strokeWidth={3} />
                  ) : (
                    <Icon
                      size={16}
                      style={{
                        color: current
                          ? "var(--accent)"
                          : "var(--text-tertiary)",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: current ? 700 : 600,
                    color: done
                      ? "var(--text-secondary)"
                      : current
                        ? "var(--accent)"
                        : "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
