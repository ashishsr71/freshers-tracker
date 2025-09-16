'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { Badge } from '@/app/dashboard/components/ui/Badge'; // Re-using our badge component
import { Receipt, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CashflowPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This query fetches from the 'transactions' collection...
    const q = query(
      collection(db, 'transactions'), 
      where("amount", "<", 0),      // ...where the amount is less than 0 (an expense)
      orderBy("timestamp", "desc") // ...ordered by the most recent first
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(items);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []); // This effect runs only once on component mount

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  }

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Just now';
    return timestamp.toDate().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* A simple public header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-800 rounded-full"></div>
              <span className="font-bold text-lg">Finance Tracker</span>
            </Link>
            <div className="flex items-center gap-4">
               <Link href="/cashflow" className="text-sm font-medium text-indigo-600">
                Public Cashflow
              </Link>
               <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                My Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Public Expense Feed</h1>
            <p className="mt-2 text-md text-gray-600">A real-time view of all expenses submitted by our community.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              <p className="ml-4 text-gray-500">Loading Expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-lg">
              <p className="text-gray-500">No expenses have been recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <ul role="list" className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <li key={expense.id} className="flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{expense.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge label={expense.category} icon={Receipt} />
                           <span className="text-xs text-gray-400 hidden sm:block">•</span>
                           <p className="text-xs text-gray-400">{formatDate(expense.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-base text-red-600">
                      {formatCurrency(expense.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}