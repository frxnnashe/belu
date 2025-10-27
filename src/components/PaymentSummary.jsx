// src/components/PaymentSummary.jsx
import { FiDollarSign, FiCheck, FiClock } from 'react-icons/fi';

export default function PaymentSummary({ darkMode, summary }) {
  const StatCard = ({ icon: Icon, title, amount, color }) => (
    <div
      className={`p-6 rounded-lg border transition ${
        darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>
            ${amount.toFixed(2)}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color.includes('green') ? darkMode ? 'bg-green-900' : 'bg-green-100' : color.includes('red') ? darkMode ? 'bg-red-900' : 'bg-red-100' : darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={FiDollarSign}
        title="Total Facturado"
        amount={summary.totalIncome}
        color={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
      />
      <StatCard
        icon={FiCheck}
        title="Total Cobrado"
        amount={summary.totalPaid}
        color={`${darkMode ? 'text-green-400' : 'text-green-600'}`}
      />
      <StatCard
        icon={FiClock}
        title="Pendiente"
        amount={summary.totalPending}
        color={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
      />
    </div>
  );
}