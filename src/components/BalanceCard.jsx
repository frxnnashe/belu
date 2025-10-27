// src/components/BalanceCard.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function BalanceCard({ darkMode, summary }) {
  const chartData = [
    {
      name: 'Mes Actual',
      Ingresos: summary.totalPaid,
      Gastos: summary.totalExpenses,
      Balance: summary.balance,
    },
  ];

  const pieData = [
    { name: 'Ingresos', value: summary.totalPaid },
    { name: 'Gastos', value: summary.totalExpenses },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  const balanceColor = summary.balance >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      {/* Balance Principal */}
      <div
        className={`p-8 rounded-lg shadow-lg border-2 transition ${
          darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Balance Neto
        </h3>
        <div className={`text-5xl font-bold ${balanceColor}`}>
          ${summary.balance.toFixed(2)}
        </div>
        <p
          className={`text-sm mt-2 ${
            summary.balance >= 0
              ? darkMode
                ? 'text-green-400'
                : 'text-green-600'
              : darkMode
                ? 'text-red-400'
                : 'text-red-600'
          }`}
        >
          {summary.balance >= 0 ? '✓ Ganancia' : '✗ Pérdida'}
        </p>
      </div>

      {/* Gráfico de Barras */}
      <div
        className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Comparativa de Ingresos vs Gastos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#475569' : '#e5e7eb'}
            />
            <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#000',
              }}
            />
            <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
            <Bar dataKey="Ingresos" fill="#10b981" />
            <Bar dataKey="Gastos" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Circular */}
      <div
        className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Distribución de Dinero
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#000',
              }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}