import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import type { Category, TransactionType } from "../types";

const INCOME_CATS: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other Income",
];
const EXPENSE_CATS: Category[] = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Other Expense",
];

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontSize: 14,
  background: "var(--bg)",
  color: "var(--text-primary)",
  outline: "none",
  fontFamily: "var(--font-body)",
};

const AddTransaction = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>("expense");
  const [form, setForm] = useState({
    amount: "",
    category: "" as Category,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const categories = type === "income" ? INCOME_CATS : EXPENSE_CATS;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.category) e.category = "Select a category";
    if (!form.description.trim()) e.description = "Add a description";
    if (!form.date) e.date = "Select a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addTransaction({
      type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description,
      date: form.date,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate("/transactions");
    }, 1500);
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 560 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Add Entry
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 13.5,
            marginTop: 4,
          }}
        >
          Record a new income or expense
        </p>
      </div>

      <div
        className="fade-up-1"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "32px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--accent-light)",
              border: "1px solid #86efac",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              marginBottom: 24,
              color: "var(--accent-dark)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={17} /> Transaction added successfully!
          </div>
        )}

        {/* Type toggle */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              display: "block",
              marginBottom: 8,
            }}
          >
            Type
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["income", "expense"] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setForm((f) => ({ ...f, category: "" as Category }));
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  borderColor:
                    type === t
                      ? t === "income"
                        ? "var(--accent)"
                        : "var(--danger)"
                      : "var(--border)",
                  background:
                    type === t
                      ? t === "income"
                        ? "var(--accent-light)"
                        : "var(--danger-light)"
                      : "transparent",
                  color:
                    type === t
                      ? t === "income"
                        ? "var(--accent-dark)"
                        : "var(--danger)"
                      : "var(--text-secondary)",
                }}
              >
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          {/* Amount */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Amount (₦)
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
              style={{
                ...inputStyle,
                borderColor: errors.amount ? "var(--danger)" : "var(--border)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.amount
                  ? "var(--danger)"
                  : "var(--border)")
              }
            />
            {errors.amount && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as Category }))
              }
              style={{
                ...inputStyle,
                borderColor: errors.category
                  ? "var(--danger)"
                  : "var(--border)",
                cursor: "pointer",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly salary - June"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              style={{
                ...inputStyle,
                borderColor: errors.description
                  ? "var(--danger)"
                  : "var(--border)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.description
                  ? "var(--danger)"
                  : "var(--border)")
              }
            />
            {errors.description && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.date ? "var(--danger)" : "var(--border)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.date
                  ? "var(--danger)"
                  : "var(--border)")
              }
            />
            {errors.date && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.date}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "13px",
              background: type === "income" ? "var(--accent)" : "var(--danger)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.88")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            <PlusCircle size={16} />
            Add {type === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
