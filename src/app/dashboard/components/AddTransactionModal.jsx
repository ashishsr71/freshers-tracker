'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Make sure collection & addDoc are imported
import { X } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { user } = useAuth(); // Get the full user object from our context
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add a transaction.");
      return;
    }
    if (!name || !amount) {
      alert("Please fill all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    const finalAmount = type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum);

    try {
      // --- CHANGE IS HERE ---
      // We are now adding to the top-level 'transactions' collection
      await addDoc(collection(db, 'transactions'), {
        name,
        amount: finalAmount,
        category,
        type,
        timestamp: serverTimestamp(),
        // We add the user's info to the document itself
        uid: user.uid,
        userEmail: user.email, 
      });
      
      setName('');
      setAmount('');
      onClose();
    } catch (error)      {
      console.error("Error adding document: ", error);
      alert("Failed to add transaction. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form inputs remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Coffee" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 150" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Food" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-700">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}