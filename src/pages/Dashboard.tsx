import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/ui/StatCard";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

const EXPENSE_COLORS: Record<string, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Housing: "#8b5cf6",
  Utilities: "#06b6d4",
  Healthcare: "#ec4899",
  Entertainment: "#f59e0b",
  Shopping: "#10b981",
  Education: "#6366f1",
  "Other Expense": "#94a3b8",
};

const Dashboard = () => {
  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    deleteTransaction,
  } = useTransactions();
  const { user } = useAuth();

  const monthlySummary = useMemo(() => {
    const map: Record<
      string,
      { month: string; income: number; expense: number }
    > = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!map[key]) map[key] = { month: label, income: 0, expense: 0 };
      map[key][t.type === "income" ? "income" : "expense"] += t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recent = transactions.slice(0, 6);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0)
      : "0";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1200 }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p
          style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}
        >
          {greeting},
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {user?.name?.split(" ")[0]} 👋
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 13.5,
            marginTop: 4,
          }}
        >
          Here's your financial overview
        </p>
      </div>

      {/* Stat Cards */}
      <div
        className="fade-up-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Net Balance"
          value={fmt(balance)}
          icon={<Wallet size={17} />}
          iconBg={balance >= 0 ? "var(--accent-light)" : "var(--danger-light)"}
          iconColor={balance >= 0 ? "var(--accent)" : "var(--danger)"}
          trend={`${savingsRate}% savings rate`}
          trendUp={balance >= 0}
        />
        <StatCard
          label="Total Income"
          value={fmt(totalIncome)}
          icon={<TrendingUp size={17} />}
          iconBg="var(--accent-light)"
          iconColor="var(--accent)"
          trend="This period"
          trendUp
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totalExpense)}
          icon={<TrendingDown size={17} />}
          iconBg="var(--danger-light)"
          iconColor="var(--danger)"
          trend={`${transactions.filter((t) => t.type === "expense").length} transactions`}
          trendUp={false}
        />
        <StatCard
          label="Transactions"
          value={String(transactions.length)}
          icon={<ArrowUpRight size={17} />}
          iconBg="#ede9fe"
          iconColor="#7c3aed"
          trend="All time"
          trendUp
        />
      </div>

      {/* Charts Row */}
      <div
        className="fade-up-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Area chart — income vs expense over time */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "22px 24px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
            Income vs Expenses
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlySummary}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#colorIncome)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2}
                fill="url(#colorExpense)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — expense by category */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "22px 24px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
            Expenses by Category
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={EXPENSE_COLORS[entry.name] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart — monthly */}
      <div
        className="fade-up-3"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "22px 24px",
          boxShadow: "var(--shadow-sm)",
          marginBottom: 28,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          Monthly Breakdown
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlySummary} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            />
            <Bar
              dataKey="income"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expense"
              fill="#fee2e2"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      <div
        className="fade-up-4"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600 }}>Recent Transactions</p>
        </div>
        <div>
          {recent.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                borderBottom:
                  i < recent.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.12s",
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    background:
                      t.type === "income"
                        ? "var(--accent-light)"
                        : "var(--danger-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {t.type === "income" ? "↑" : "↓"}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500 }}>
                    {t.description}
                  </p>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {t.category} ·{" "}
                    {new Date(t.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13.5,
                    fontWeight: 500,
                    color:
                      t.type === "income" ? "var(--accent)" : "var(--danger)",
                  }}
                >
                  {t.type === "income" ? "+" : "-"}
                  {fmt(t.amount)}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 6,
                    transition: "color 0.12s",
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
