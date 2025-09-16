import { Summary } from './components/Summary';
import { Transactions } from './components/Transactions';

export default function DashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* The Header component from the previous request would go here in your layout.jsx */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Summary />
          <Transactions />
        </div>
      </main>
    </div>
  );
}