export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Gift"
  | "Other Income"
  | "Food"
  | "Transport"
  | "Housing"
  | "Utilities"
  | "Healthcare"
  | "Entertainment"
  | "Shopping"
  | "Education"
  | "Other Expense";

export type Transaction = {
  _id?: string;
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
  createdAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  currency?: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

export type AIInsight = {
  title: string;
  message: string;
  type: "tip" | "warning" | "positive";
};

export type MonthlySummary = {
  month: string;
  income: number;
  expense: number;
};
