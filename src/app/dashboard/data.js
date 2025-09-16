import { ArrowDownRight, ArrowUpRight, Banknote, Car, Coffee, Home, Pizza, Receipt, ShoppingCart, Train, Utensils, Wallet } from "lucide-react";

export const summaryData = {
  netTotal: 218493.21,
  netTotalChange: 1.3,
  stats: [
    {
      title: "Collection",
      amount: 135780.47,
      change: 13,
      changeType: "increase",
      icon: ArrowUpRight,
      color: "text-green-600",
    },
    {
      title: "Expenses",
      amount: 87600.34,
      percentage: 73,
      change: 4,
      changeType: "increase",
      icon: ArrowUpRight,
      color: "text-red-600",
    },
    {
      title: "Investment",
      amount: 48500.00,
      percentage: 21,
      change: -6,
      changeType: "decrease",
      icon: ArrowDownRight,
      color: "text-red-600",
    },
    {
      title: "Savings",
      amount: 23435.00,
      percentage: 6,
      change: 3,
      changeType: "increase",
      icon: ArrowUpRight,
      color: "text-green-600",
    },
  ],
  progressBar: [
    { percentage: 73, color: "bg-red-500", label: "Expenses" },
    { percentage: 21, color: "bg-blue-500", label: "Investment" },
    { percentage: 6, color: "bg-yellow-400", label: "Savings" },
  ],
};

export const transactionsData = [
  {
    date: "Today",
    transactions: [
      { id: 1, name: "Netflix", category: "Streaming", categoryIcon: Receipt, amount: -17.99, icon: "N" },
      { id: 2, name: "Rent", category: "Home", categoryIcon: Home, amount: -1799, icon: "🏠" },
    ],
  },
  {
    date: "Yesterday",
    transactions: [
      { id: 3, name: "Salary", category: "Salary", categoryIcon: Banknote, amount: 11425.26, icon: "✅" },
      { id: 4, name: "Car payment", category: "Car", categoryIcon: Car, amount: -347.50, icon: "🚗" },
      { id: 5, name: "Food", category: "Groceries", categoryIcon: ShoppingCart, amount: -27.19, icon: "🍔" },
    ],
  },
];

export const categoryData = {
  home: [
    { name: 'Rent', icon: Home },
    { name: 'Groceries', icon: ShoppingCart }
  ],
  leisure: [
    { name: 'Streaming', icon: Receipt },
    { name: 'Restaurant', icon: Utensils },
    { name: 'Coffee', icon: Coffee },
    { name: 'Travel', icon: Train }
  ]
};