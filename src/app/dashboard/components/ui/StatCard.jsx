export function StatCard({ title, amount, percentage, change, changeType, icon: Icon, color }) {
  const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <span className="text-sm text-gray-500">{title}</span>
        {percentage && <span className="text-sm font-semibold text-gray-600">{percentage}%</span>}
      </div>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(amount)}</p>
      <div className={`flex items-center gap-1 text-sm mt-2 ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{Math.abs(change)}% vs last year</span>
      </div>
    </div>
  );
}