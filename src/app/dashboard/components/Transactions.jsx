'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, MoreVertical, Plus, Pencil, Trash2, Receipt } from 'lucide-react';
import { Badge } from './ui/Badge';
import AddTransactionModal from './AddTransactionModal';
import clsx from 'clsx';

export function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); 
  const [filterType, setFilterType] = useState('all');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null); // State to hold the transaction being edited

  const menuRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // Fetching logic remains the same
  useEffect(() => {
    if (!user) { setTransactions([]); return; }
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // Click outside logic remains the same
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) setIsTypeDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Filtering logic remains the same
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return transactions;
    return transactions.filter(t => (filterType === 'income' ? t.amount > 0 : t.amount < 0));
  }, [transactions, filterType]);

  // --- NEW HANDLERS FOR EDIT & DELETE ---
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
    setOpenMenuId(null); // Close the dropdown
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const docRef = doc(db, 'transactions', transactionId);
        await deleteDoc(docRef);
      } catch (error) {
        console.error("Error deleting transaction: ", error);
        alert("Failed to delete transaction.");
      }
    }
    setOpenMenuId(null); // Close the dropdown
  };
  
  const handleOpenAddModal = () => {
    setEditingTransaction(null); // Ensure we are in "add" mode
    setIsModalOpen(true);
  };
  
  const handleMenuToggle = (transactionId) => setOpenMenuId(prevId => (prevId === transactionId ? null : transactionId));
  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  const handleFilterSelect = (type) => { setFilterType(type); setIsTypeDropdownOpen(false); };

  return (
    <>
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={editingTransaction}
      />
      <section>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          {/* Header section remains the same */}
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">Your recent financial activity.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* ... Type dropdown ... */}
            <div className="relative" ref={typeDropdownRef}>
              <button onClick={() => setIsTypeDropdownOpen(prev => !prev)} className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 capitalize">{filterType}<ChevronDown className="h-4 w-4" /></button>
              {isTypeDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg border z-20"><div className="py-1">
                    <button onClick={() => handleFilterSelect('all')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All</button>
                    <button onClick={() => handleFilterSelect('income')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Income</button>
                    <button onClick={() => handleFilterSelect('expense')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Expense</button>
                </div></div>
              )}
            </div>
            <button onClick={handleOpenAddModal} className="flex items-center gap-1 text-sm font-medium text-white bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700"><Plus className="h-4 w-4" />Add</button>
          </div>
        </div>
        
        <div className="mt-6 flow-root">
            {/* ... Empty state and list rendering ... */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <ul role="list" className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <li key={transaction.id} className="flex items-center justify-between p-4">
                    {/* ... Transaction details */}
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                          <p className="font-medium text-gray-800">{transaction.name}</p>
                          <Badge label={transaction.category} icon={Receipt} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={clsx("font-semibold", transaction.amount > 0 ? "text-green-600" : "text-gray-800")}>{formatCurrency(transaction.amount)}</p>
                      
                      {/* --- DROPDOWN MENU IS HERE --- */}
                      <div className="relative">
                        <button onClick={() => handleMenuToggle(transaction.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><MoreVertical className="h-5 w-5" /></button>
                        {openMenuId === transaction.id && (
                          <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                            <div className="py-1">
                              <button onClick={() => handleEdit(transaction)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"><Pencil className="h-4 w-4" />Edit Transaction</button>
                              <button onClick={() => handleDelete(transaction.id)} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2"><Trash2 className="h-4 w-4" />Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </section>
    </>
  );
}
