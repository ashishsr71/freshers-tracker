import React from 'react';

export function Badge({ label, icon: Icon }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}