// src/components/ExpenseModal.jsx
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const categories = ['Alquiler', 'Insumos', 'Servicios', 'Otros'];

export default function ExpenseModal({ darkMode, isOpen, onClose, onSave, expense }) {
  const [formData, setFormData] = useState({
    date: '',
    category: 'Otros',
    description: '',
    amount: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'Otros',
        description: '',
        amount: '',
      });
    }
  }, [expense, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.amount) {
      alert('Por favor completa todos los campos');
      return;
    }
    // Convertir amount a número
    const dataToSave = {
      ...formData,
      amount: Number(formData.amount) || 0
    };
    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-md`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onClose} className="hover:opacity-70">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Fecha */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Fecha *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles del gasto..."
              rows="3"
              className={`w-full px-3 py-2 rounded-lg border transition resize-none ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Monto */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Monto ($) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}