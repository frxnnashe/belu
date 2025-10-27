// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import PaymentSummary from '../components/PaymentSummary';
import BalanceCard from '../components/BalanceCard';
import { useFirestore } from '../hooks/useFirestore';
import { FiTrendingUp, FiTrendingDown, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage({ darkMode }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalPaid: 0,
    totalPending: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [monthStats, setMonthStats] = useState({
    currentMonth: {},
    previousMonth: {},
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  const { getDocuments: getAppointments } = useFirestore('appointments');
  const { getDocuments: getExpenses } = useFirestore('expenses');

  useEffect(() => {
    calculateSummary();
    calculateHistoricalData();
  }, [selectedDate]);

  const calculateSummary = async () => {
    setLoading(true);
    try {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();

      console.log('🔍 Calculando resumen para:', { month, year });

      // Obtener turnos
      const appointments = await getAppointments();
      console.log('📅 Turnos obtenidos:', appointments.length);

      const monthAppointments = appointments.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
      console.log('📅 Turnos del mes actual:', monthAppointments.length);

      // Obtener gastos
      const expenses = await getExpenses();
      console.log('💸 Gastos obtenidos:', expenses.length);
      console.log('💸 Gastos data:', expenses);

      const monthExpenses = expenses.filter((e) => {
        const date = new Date(e.date);
        const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
        console.log('Gasto:', e.date, 'Es del mes?', isCurrentMonth);
        return isCurrentMonth;
      });
      console.log('💸 Gastos del mes actual:', monthExpenses.length);

      // Calcular totales
      const totalIncome = monthAppointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const totalPaid = monthAppointments
        .filter((a) => a.paid)
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const totalPending = totalIncome - totalPaid;
      const totalExpenses = monthExpenses.reduce((sum, e) => {
        const amount = Number(e.amount) || 0;
        console.log('Sumando gasto:', e.description, amount);
        return sum + amount;
      }, 0);
      const balance = totalPaid - totalExpenses;

      console.log('💰 RESUMEN:', {
        totalIncome,
        totalPaid,
        totalPending,
        totalExpenses,
        balance
      });

      setSummary({
        totalIncome,
        totalPaid,
        totalPending,
        totalExpenses,
        balance,
      });

      setDebugInfo({
        totalAppointments: appointments.length,
        monthAppointments: monthAppointments.length,
        totalExpenses: expenses.length,
        monthExpenses: monthExpenses.length,
        expensesDetail: monthExpenses.map(e => ({
          date: e.date,
          amount: e.amount,
          description: e.description
        }))
      });

      // Cálculos para el mes anterior
      const prevDate = new Date(year, month - 1);
      const prevMonth = prevDate.getMonth();
      const prevYear = prevDate.getFullYear();

      const prevAppointments = appointments.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
      });

      const prevExpenses = expenses.filter((e) => {
        const date = new Date(e.date);
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
      });

      const prevPaid = prevAppointments
        .filter((a) => a.paid)
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const prevExpensesTotal = prevExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const prevBalance = prevPaid - prevExpensesTotal;

      setMonthStats({
        currentMonth: { paid: totalPaid, expenses: totalExpenses, balance },
        previousMonth: { paid: prevPaid, expenses: prevExpensesTotal, balance: prevBalance },
      });

    } catch (error) {
      console.error('❌ Error calculando resumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHistoricalData = async () => {
    try {
      const appointments = await getAppointments();
      const expenses = await getExpenses();
      
      // Obtener últimos 6 meses desde el mes seleccionado
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthAppointments = appointments.filter((a) => {
          const d = new Date(a.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });

        const monthExpenses = expenses.filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });

        const paid = monthAppointments
          .filter((a) => a.paid)
          .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
        const expensesTotal = monthExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        months.push({
          name: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
          Ingresos: paid,
          Gastos: expensesTotal,
          Balance: paid - expensesTotal,
        });
      }

      setHistoricalData(months);
    } catch (error) {
      console.error('Error calculando histórico:', error);
    }
  };

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedDate.getMonth() === now.getMonth() && 
           selectedDate.getFullYear() === now.getFullYear();
  };

  const balanceChange = summary.balance - (monthStats.previousMonth.balance || 0);
  const isPositive = balanceChange >= 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Cargando datos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navegación de Meses */}
      <div className={`p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className={`p-3 rounded-lg transition flex items-center gap-2 ${
              darkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <FiChevronLeft size={20} />
            <span className="text-sm font-medium">Anterior</span>
          </button>

          <div className="flex items-center gap-3">
            <FiCalendar size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h2>
              {!isCurrentMonth() && (
                <button
                  onClick={goToCurrentMonth}
                  className={`text-sm mt-1 transition ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Volver al mes actual
                </button>
              )}
            </div>
          </div>

          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth()}
            className={`p-3 rounded-lg transition flex items-center gap-2 ${
              isCurrentMonth()
                ? darkMode ? 'bg-slate-700/50 text-gray-600 cursor-not-allowed' : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                : darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <span className="text-sm font-medium">Siguiente</span>
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Encabezado con Comparativa */}
      <div className={`p-8 rounded-lg shadow-lg ${
        darkMode
          ? 'bg-gradient-to-br from-blue-900 to-slate-800'
          : 'bg-gradient-to-br from-blue-50 to-white'
      }`}>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Dashboard - Resumen Mensual
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </p>

        {/* Cambio respecto mes anterior */}
        {monthStats.previousMonth.balance !== undefined && monthStats.previousMonth.balance !== 0 && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            isPositive
              ? darkMode ? 'bg-green-900/50' : 'bg-green-100'
              : darkMode ? 'bg-red-900/50' : 'bg-red-100'
          }`}>
            {isPositive ? (
              <FiTrendingUp size={24} className="text-green-500" />
            ) : (
              <FiTrendingDown size={24} className="text-red-500" />
            )}
            <div>
              <p className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''} ${Math.abs(balanceChange).toFixed(2)} vs mes anterior
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {isPositive ? '📈 Mejor desempeño' : '📉 Menor desempeño'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resumen de Pagos */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💰 Movimiento de Pagos
        </h2>
        <PaymentSummary darkMode={darkMode} summary={summary} />
      </div>

      {/* Tarjeta de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💸 Total Gastos del Mes
          </p>
          <p className="text-3xl font-bold mt-2 text-red-500">
            ${summary.totalExpenses.toFixed(2)}
          </p>
          <p className="text-xs mt-1 text-gray-500">
            {debugInfo?.monthExpenses} gasto(s) registrado(s)
          </p>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💵 Balance Neto
          </p>
          <p className={`text-3xl font-bold mt-2 ${summary.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${summary.balance.toFixed(2)}
          </p>
          <p className={`text-sm mt-1 ${
            summary.balance >= 0
              ? darkMode ? 'text-green-400' : 'text-green-600'
              : darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {summary.balance >= 0 ? '✓ Ganancia' : '✗ Pérdida'}
          </p>
        </div>
      </div>

      {/* Gráfico de Tendencia Histórica */}
      {historicalData.length > 0 && (
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📈 Tendencia Últimos 6 Meses
          </h2>
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#fff' : '#000',
                  }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
                <Line 
                  type="monotone" 
                  dataKey="Ingresos" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Gastos" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Balance y Gráficos */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📈 Análisis Financiero
        </h2>
        <BalanceCard darkMode={darkMode} summary={summary} />
      </div>

      {/* Alertas */}
      {summary.totalExpenses === 0 && (
        <div className={`p-6 rounded-lg border-l-4 ${
          darkMode
            ? 'bg-yellow-900/20 border-yellow-500'
            : 'bg-yellow-50 border-yellow-400'
        }`}>
          <h3 className={`font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
            ⚠️ Sin gastos registrados
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            No hay gastos registrados para este mes. Ve a la sección de Gastos para agregarlos.
          </p>
        </div>
      )}

      {summary.totalPending > 0 && (
        <div className={`p-6 rounded-lg border-l-4 ${
          darkMode
            ? 'bg-yellow-900/20 border-yellow-500'
            : 'bg-yellow-50 border-yellow-400'
        }`}>
          <h3 className={`font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
            ⚠️ Recordatorio de Pagos Pendientes
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Tienes <strong>${summary.totalPending.toFixed(2)}</strong> pendiente de cobrar en este mes.
          </p>
        </div>
      )}

      {summary.balance < 0 && (
        <div className={`p-6 rounded-lg border-l-4 ${
          darkMode
            ? 'bg-red-900/20 border-red-500'
            : 'bg-red-50 border-red-400'
        }`}>
          <h3 className={`font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
            ⚠️ Balance Negativo
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Tus gastos (${summary.totalExpenses.toFixed(2)}) superan tus ingresos (${summary.totalPaid.toFixed(2)}). Considera revisar tus costos operacionales.
          </p>
        </div>
      )}

      {/* Botón para recargar */}
      <div className="text-center">
        <button
          onClick={() => {
            console.log('🔄 Recalculando...');
            calculateSummary();
            calculateHistoricalData();
          }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          🔄 Recargar Datos
        </button>
      </div>
    </div>
  );
}