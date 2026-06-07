import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { Transaction } from "../types";
import { mockTransactions } from "../data/mockData";
import { nanoid } from "nanoid";

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: nanoid() }, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions must be inside TransactionProvider");
  return ctx;
};
