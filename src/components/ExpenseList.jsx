// src/components/ExpenseList.jsx
import { useState } from 'react';
import { FiTrash2, FiEdit2, FiFilter, FiPlus } from 'react-icons/fi';
import { formatDate } from '../utils/dateUtils';

const categories = ['Todos', 'Alquiler', 'Insumos', 'Servicios', 'Otros'];

export default function ExpenseList({
  darkMode,
  expenses,
  monthExpenses,
  monthTotal,
  onEdit,
  onDelete,
  onAddNew,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered =
    selectedCategory === 'Todos'
      ? monthExpenses
      : monthExpenses.filter((e) => e.category === selectedCategory);

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💸 Gastos del Mes
          </h2>
          <p className={`text-lg font-semibold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Total: ${monthTotal.toFixed(2)}
          </p>
        </div>
        <button
          onClick={onAddNew}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${
            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <FiPlus size={20} /> Nuevo
        </button>
      </div>

      {/* Filtro de Categoría */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat
                ? darkMode
                  ? 'bg-green-600 text-white'
                  : 'bg-green-500 text-white'
                : darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Gastos */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((expense) => (
            <div
              key={expense.id}
              className={`p-4 rounded-lg border flex justify-between items-center transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{expense.category}</span>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {expense.description}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-red-500">-${(Number(expense.amount) || 0).toFixed(2)}</p>
                <button
                  onClick={() => onEdit(expense)}
                  className={`p-2 rounded transition ${
                    darkMode
                      ? 'bg-slate-600 hover:bg-slate-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className={`p-2 rounded transition ${
                    darkMode
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                  }`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No hay gastos en esta categoría
          </div>
        )}
      </div>
    </div>
  );
}