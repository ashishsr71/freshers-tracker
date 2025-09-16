'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
// --- CHANGES ARE HERE ---
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, MoreVertical, Plus, Download, Pencil, Trash2, Receipt } from 'lucide-react';
import { Badge } from './ui/Badge';
import AddTransactionModal from './AddTransactionModal';
import clsx from 'clsx';

export function Transactions() {
  const { user } = useAuth(); // Get the logged-in user
  const [transactions, setTransactions] = useState([]); // State to hold data from Firestore
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); 
  const [filterType, setFilterType] = useState('all');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  const menuRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // --- THIS ENTIRE EFFECT IS UPDATED ---
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    // Create the query
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef, 
      where("uid", "==", user.uid), 
      orderBy('timestamp', 'desc') 
    );

    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(items);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [user]); // Rerun the effect if the user changes


  // The rest of the component logic remains largely the same...
  const handleMenuToggle = (transactionId) => {
    setOpenMenuId(prevId => (prevId === transactionId ? null : transactionId));
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return transactions;
    if (filterType === 'income') return transactions.filter(t => t.amount > 0);
    if (filterType === 'expense') return transactions.filter(t => t.amount < 0);
    return transactions;
  }, [transactions, filterType]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  }

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setIsTypeDropdownOpen(false);
  };

  return (
    <>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section>
        {/* The header and filter UI remains the same */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">Your recent financial activity.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="relative" ref={typeDropdownRef}>
              <button onClick={() => setIsTypeDropdownOpen(prev => !prev)} className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 capitalize">
                {filterType}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button onClick={() => handleFilterSelect('all')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All</button>
                    <button onClick={() => handleFilterSelect('income')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Income</button>
                    <button onClick={() => handleFilterSelect('expense')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Expense</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 text-sm font-medium text-white bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
        
        {/* The list rendering logic remains the same, but now uses the filtered data from Firestore */}
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-500">No transactions found.</p>
                  <p className="text-sm text-gray-400">Click "+ Add" to record your first transaction.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <ul role="list" className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <li key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full text-lg font-bold text-gray-700 flex-shrink-0">
                            {transaction.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{transaction.name}</p>
                            <Badge label={transaction.category} icon={Receipt} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between pl-14 sm:pl-0">
                          <p className={clsx("font-semibold text-base", transaction.amount > 0 ? "text-green-600" : "text-gray-800")}>
                            {transaction.amount > 0 ? `+${formatCurrency(transaction.amount)}` : formatCurrency(transaction.amount)}
                          </p>
                          <div className="relative">
                            <button onClick={() => handleMenuToggle(transaction.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                            {openMenuId === transaction.id && (
                              <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                {/* Dropdown menu options */}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}