import { useState, useMemo } from "react";
import { Search, Trash2, Filter } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">(
    "newest",
  );

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (search)
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (typeFilter !== "all")
      result = result.filter((t) => t.type === typeFilter);
    if (sort === "newest")
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    else if (sort === "oldest")
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    else if (sort === "highest") result.sort((a, b) => b.amount - a.amount);
    else result.sort((a, b) => a.amount - b.amount);
    return result;
  }, [transactions, search, typeFilter, sort]);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Transactions
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 13.5,
            marginTop: 4,
          }}
        >
          {filtered.length} of {transactions.length} entries
        </p>
      </div>

      {/* Filters */}
      <div
        className="fade-up-1"
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        {/* Search */}
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "9px 14px",
          }}
        >
          <Search
            size={14}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 13.5,
              width: "100%",
              fontFamily: "var(--font-body)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Type filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.12s",
                borderColor:
                  typeFilter === f
                    ? f === "income"
                      ? "var(--accent)"
                      : f === "expense"
                        ? "var(--danger)"
                        : "var(--bg-sidebar)"
                    : "var(--border)",
                background:
                  typeFilter === f
                    ? f === "income"
                      ? "var(--accent-light)"
                      : f === "expense"
                        ? "var(--danger-light)"
                        : "var(--bg-sidebar)"
                    : "var(--bg-card)",
                color:
                  typeFilter === f
                    ? f === "income"
                      ? "var(--accent)"
                      : f === "expense"
                        ? "var(--danger)"
                        : "#fff"
                    : "var(--text-secondary)",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={13} style={{ color: "var(--text-muted)" }} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              outline: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="fade-up-2"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        {/* Table head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 120px 100px 48px",
            padding: "12px 20px",
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span style={{ textAlign: "right" }}>Amount</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            No transactions found
          </div>
        ) : (
          filtered.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 120px 100px 48px",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--bg)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    flexShrink: 0,
                    background:
                      t.type === "income"
                        ? "var(--accent-light)"
                        : "var(--danger-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                >
                  {t.type === "income" ? "↑" : "↓"}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>
                  {t.description}
                </span>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                {t.category}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                {new Date(t.date).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "right",
                  color:
                    t.type === "income" ? "var(--accent)" : "var(--danger)",
                }}
              >
                {t.type === "income" ? "+" : "-"}
                {fmt(t.amount)}
              </span>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 4,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--danger)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--text-muted)")
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
