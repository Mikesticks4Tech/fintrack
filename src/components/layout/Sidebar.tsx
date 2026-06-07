import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  Sparkles,
  LogOut,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/add", icon: PlusCircle, label: "Add Entry" },
  { to: "/insights", icon: Sparkles, label: "AI Insights" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        padding: "0",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={17} color="#fff" />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              FinTrack
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 10,
                marginTop: 2,
              }}
            >
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 500,
              transition: "all 0.15s",
              color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
              background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 12px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.35)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#ef4444";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.35)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut size={15} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
