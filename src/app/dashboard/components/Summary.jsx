'use client';
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Reusable component for the Stat Cards
function StatCard({ title, amount, percentage, icon: Icon, color }) {
  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <span className="text-sm text-gray-500">{title}</span>
        {percentage && <span className="text-sm font-semibold text-gray-600">{percentage}%</span>}
      </div>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(amount)}</p>
      {/* "vs last year" text is removed as we are not calculating it */}
      <div className={`flex items-center gap-1 text-sm mt-2 ${color}`}>
        <Icon className="h-4 w-4" />
        <span>This month</span>
      </div>
    </div>
  );
}

// Reusable Progress Bar Component
function ProgressBar({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-2 bg-gray-200 rounded-full"></div>;
  }
  return (
    <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      {data.map((item, index) => (
        <div
          key={index}
          className={`${item.color}`}
          style={{ width: `${item.percentage}%` }}
          title={`${item.label}: ${item.percentage.toFixed(1)}%`}
        ></div>
      ))}
    </div>
  );
}

export function Summary() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  // 1. FETCH DATA FROM FIRESTORE (just like in Transactions.jsx)
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setTransactions(items);
    });
    return () => unsubscribe();
  }, [user]);

  // 2. CALCULATE SUMMARY STATS
  const summaryStats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const calcExpenseTotal = (category) => transactions
      .filter(t => t.category === category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalInvestment = calcExpenseTotal('Investment');
    const totalSavings = calcExpenseTotal('Savings');
    
    // All other negative transactions are considered general expenses
    const totalExpenses = transactions
      .filter(t => t.amount < 0 && t.category !== 'Investment' && t.category !== 'Savings')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const grandTotalExpenses = totalExpenses + totalInvestment + totalSavings;
    const netTotal = totalIncome - grandTotalExpenses;

    const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const investmentPercentage = totalIncome > 0 ? (totalInvestment / totalIncome) * 100 : 0;
    const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    return {
      netTotal,
      totalIncome,
      totalExpenses,
      totalInvestment,
      totalSavings,
      progressBarData: [
        { percentage: expensePercentage, color: "bg-red-500", label: "Expenses" },
        { percentage: investmentPercentage, color: "bg-blue-500", label: "Investment" },
        { percentage: savingsPercentage, color: "bg-yellow-400", label: "Savings" },
      ]
    };
  }, [transactions]);

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Summary</h1>
        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
          This Month
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-sm text-gray-500">Net Total</h2>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {formatCurrency(summaryStats.netTotal)}
          </p>
        </div>
        <div className="lg:col-span-2 flex items-end">
          <ProgressBar data={summaryStats.progressBarData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard title="Income" amount={summaryStats.totalIncome} icon={ArrowUpRight} color="text-green-600" />
        <StatCard title="Expenses" amount={summaryStats.totalExpenses} icon={ArrowUpRight} color="text-red-600" />
        <StatCard title="Investment" amount={summaryStats.totalInvestment} icon={ArrowUpRight} color="text-blue-600" />
        <StatCard title="Savings" amount={summaryStats.totalSavings} icon={ArrowUpRight} color="text-yellow-600" />
      </div>
    </section>
  );
}