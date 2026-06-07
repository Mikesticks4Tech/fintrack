import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import type { AIInsight } from "../types";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

const iconMap = {
  tip: <Lightbulb size={16} />,
  warning: <AlertTriangle size={16} />,
  positive: <TrendingUp size={16} />,
};
const colorMap = {
  tip: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", icon: "#3b82f6" },
  warning: {
    bg: "var(--warning-light)",
    border: "#fcd34d",
    color: "var(--warning)",
    icon: "var(--warning)",
  },
  positive: {
    bg: "var(--accent-light)",
    border: "#86efac",
    color: "var(--accent-dark)",
    icon: "var(--accent)",
  },
};

const AIInsights = () => {
  const { transactions, totalIncome, totalExpense, balance } =
    useTransactions();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    setError("");

    // Build a summary for Claude
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] ?? 0) + t.amount;
      });

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: ${fmt(amt)}`)
      .join(", ");

    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
        : "0";

    const prompt = `You are a personal finance advisor. Analyze this user's financial data and return ONLY a JSON array (no markdown, no preamble) with 5 insights.

Financial Summary:
- Total Income: ${fmt(totalIncome)}
- Total Expenses: ${fmt(totalExpense)}
- Net Balance: ${fmt(balance)}
- Savings Rate: ${savingsRate}%
- Top expense categories: ${topCategories}
- Number of transactions: ${transactions.length}

Return exactly this JSON structure:
[
  {"title": "...", "message": "...", "type": "positive|warning|tip"}
]

Rules:
- Each insight must be specific to the numbers above
- Include ₦ amounts where relevant
- type "positive" = good news, "warning" = concern, "tip" = actionable advice
- Make insights practical and Nigerian-context-aware
- Keep messages concise (1-2 sentences max)`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text =
        data.content
          ?.map((c: { type: string; text?: string }) =>
            c.type === "text" ? c.text : "",
          )
          .join("") ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: AIInsight[] = JSON.parse(clean);
      setInsights(parsed);
      setGenerated(true);
    } catch (err) {
      setError(
        "Couldn't generate insights right now. Make sure your API key is set in the backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : "0";

  return (
    <div style={{ padding: "32px 36px", maxWidth: 700 }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={17} color="#fff" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            AI Insights
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>
          Claude analyses your finances and gives you personalised advice
        </p>
      </div>

      {/* Summary strip */}
      <div
        className="fade-up-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Income", value: fmt(totalIncome), color: "var(--accent)" },
          {
            label: "Expenses",
            value: fmt(totalExpense),
            color: "var(--danger)",
          },
          { label: "Savings rate", value: `${savingsRate}%`, color: "#7c3aed" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                fontWeight: 500,
                color,
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="fade-up-2" style={{ marginBottom: 28 }}>
        <button
          onClick={generateInsights}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            background: loading
              ? "var(--border-strong)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
            boxShadow: loading ? "none" : "0 4px 14px rgba(102,126,234,0.35)",
          }}
          onMouseEnter={(e) =>
            !loading && ((e.currentTarget as HTMLElement).style.opacity = "0.9")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "1")
          }
        >
          {loading ? (
            <>
              <RefreshCw
                size={15}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Analysing your finances...
            </>
          ) : (
            <>
              <Sparkles size={15} />{" "}
              {generated ? "Regenerate insights" : "Generate AI insights"}
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "var(--danger-light)",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-sm)",
            padding: "12px 16px",
            color: "var(--danger)",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 80,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: `linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%)`,
                backgroundSize: "200% 100%",
                animation: `shimmer 1.5s ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Insights */}
      {!loading && insights.length > 0 && (
        <div
          className="fade-in"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {insights.map((insight, i) => {
            const colors = colorMap[insight.type] ?? colorMap.tip;
            return (
              <div
                key={i}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "var(--radius)",
                  padding: "18px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.icon,
                    flexShrink: 0,
                  }}
                >
                  {iconMap[insight.type]}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.color,
                      marginBottom: 4,
                    }}
                  >
                    {insight.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                    }}
                  >
                    {insight.message}
                  </p>
                </div>
              </div>
            );
          })}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Insights powered by Claude AI · Based on {transactions.length}{" "}
            transactions
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !generated && insights.length === 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "48px 32px",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 16px",
              background:
                "linear-gradient(135deg, #667eea22 0%, #764ba222 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={24} style={{ color: "#667eea" }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Ready to analyse your finances
          </h3>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--text-muted)",
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Click the button above and Claude will review your income, expenses,
            and spending patterns to give you personalised advice.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AIInsights;
