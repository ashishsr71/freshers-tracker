'use client';

import { Check, Search } from 'lucide-react';
import { categoryData } from '../data';
import { useState } from 'react';

export function CategoryDropdown() {
  const [selected, setSelected] = useState('Rent');

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="p-2 max-h-60 overflow-y-auto">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider">Home</h3>
          <ul>
            {categoryData.home.map(item => (
              <li key={item.name} onClick={() => setSelected(item.name)} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-gray-500" />
                  <span>{item.name}</span>
                </div>
                {selected === item.name && <Check className="h-4 w-4 text-indigo-600" />}
              </li>
            ))}
          </ul>
        </div>
         <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider">Leisure</h3>
          <ul>
            {categoryData.leisure.map(item => (
              <li key={item.name} onClick={() => setSelected(item.name)} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-gray-500" />
                  <span>{item.name}</span>
                </div>
                {selected === item.name && <Check className="h-4 w-4 text-indigo-600" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 p-2 text-sm">
        <button className="w-full text-left p-2 rounded-md hover:bg-gray-100">View all categories</button>
        <button className="w-full text-left p-2 rounded-md hover:bg-gray-100">Add new category</button>
      </div>
    </div>
  );
}