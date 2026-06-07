import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wallet, Eye, EyeOff, ArrowRight } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const ok = await register(form.name, form.email, form.password);
    setLoading(false);
    if (ok) navigate("/dashboard");
    else setError("Registration failed. Try again.");
  };

  const fields = [
    {
      key: "name",
      label: "Full name",
      type: "text",
      placeholder: "Mike Adeyemi",
    },
    {
      key: "email",
      label: "Email address",
      type: "email",
      placeholder: "mike@example.com",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "fixed",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "var(--bg-sidebar)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={18} color="var(--accent)" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            FinTrack
          </span>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "36px 32px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Create account
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 14,
              marginBottom: 28,
            }}
          >
            Start tracking your finances today
          </p>

          {error && (
            <div
              style={{
                background: "var(--danger-light)",
                border: "1px solid #fca5a5",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                color: "var(--danger)",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 14,
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            ))}

            {/* Password */}
            {(["password", "confirm"] as const).map((key) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {key === "password" ? "Password" : "Confirm password"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "11px 42px 11px 14px",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 14,
                      background: "var(--bg)",
                      color: "var(--text-primary)",
                      outline: "none",
                      fontFamily: "var(--font-body)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                  {key === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "12px",
                background: loading
                  ? "var(--border-strong)"
                  : "var(--bg-sidebar)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.15s",
              }}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "var(--text-secondary)",
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
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
