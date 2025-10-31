// src/components/TurnoModal.jsx
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

// Función helper para convertir Date a string local YYYY-MM-DD
const dateToLocalString = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TurnoModal({ darkMode, isOpen, onClose, onSave, turno, patients, selectedDate }) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    insurance: '',
    amount: '',
    paid: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    if (turno) {
      setFormData(turno);
      setSearchTerm(turno.patientName);
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        date: selectedDate ? dateToLocalString(selectedDate) : '',
        time: '',
        insurance: '',
        amount: '',
        paid: false,
      });
      setSearchTerm('');
    }
  }, [turno, isOpen, selectedDate]);

  const handlePatientSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = patients.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowDropdown(true);
    } else {
      setFilteredPatients([]);
      setShowDropdown(false);
    }
  };

  const selectPatient = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      insurance: patient.insurance || '',
    }));
    setSearchTerm(patient.name);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.time || !formData.amount || !formData.date) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Convertir amount a número y asegurar que la fecha se guarde correctamente
    const dataToSave = {
      ...formData,
      amount: Number(formData.amount) || 0,
      date: formData.date // Ya está en formato YYYY-MM-DD
    };
    
    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {turno ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Paciente */}
          <div className="relative">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Paciente *
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handlePatientSearch(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
              placeholder="Buscar paciente..."
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
            {showDropdown && filteredPatients.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto ${
                darkMode ? 'bg-slate-700' : 'bg-white border border-gray-300'
              }`}>
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatient(p)}
                    className={`w-full text-left px-3 py-2 transition ${
                      darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {p.name} ({p.dni})
                  </button>
                ))}
              </div>
            )}
          </div>

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
              required
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Hora */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Hora *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Obra Social */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Obra Social
            </label>
            <input
              type="text"
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              placeholder="Ej: OSDE, SWISS..."
              className={`w-full px-3 py-2 rounded-lg border transition ${
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
              required
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Estado de Pago */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="paid"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="paid" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Pagado
            </label>
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
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
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