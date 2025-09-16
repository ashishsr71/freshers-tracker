import { summaryData } from '@/app/dashboard/data';

export function ProgressBar() {
  const { progressBar } = summaryData;
  const expenseItem = progressBar.find(item => item.label === 'Expenses');

  return (
    <div className="relative pt-8">
      {expenseItem && (
        <div 
          className="absolute top-0 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md"
          style={{ left: `${expenseItem.percentage / 2}%`, transform: 'translateX(-50%)' }}
        >
          {expenseItem.label} {expenseItem.percentage}%
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {progressBar.map((item, index) => (
          <div
            key={index}
            className={`${item.color}`}
            style={{ width: `${item.percentage}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}