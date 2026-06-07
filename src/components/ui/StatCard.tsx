import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
};

const StatCard = ({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
  className = "",
}: Props) => (
  <div
    className={className}
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "22px 24px",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: "var(--text-secondary)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
    </div>
    <div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 24,
          fontWeight: 500,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {trend && (
        <p
          style={{
            fontSize: 12,
            marginTop: 6,
            color: trendUp ? "var(--accent)" : "var(--danger)",
          }}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  </div>
);

export default StatCard;
