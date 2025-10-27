// src/components/RecurringPatientModal.jsx
import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';

export default function RecurringPatientModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  onSave, 
  patients, 
  currentMonth 
}) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    insurance: '',
    amount: '',
    time: '',
    weekDays: [], // [1, 3, 5] para Lun, Mié, Vie
    startDate: '',
    endDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [generatedCount, setGeneratedCount] = useState(0);

  const weekDaysOptions = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
  ];

  useEffect(() => {
    if (isOpen) {
      // Establecer fechas por defecto
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      setFormData({
        patientId: '',
        patientName: '',
        insurance: '',
        amount: '',
        time: '',
        weekDays: [],
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
      });
      setSearchTerm('');
      calculateGeneratedAppointments([], firstDay, lastDay);
    }
  }, [isOpen, currentMonth]);

  useEffect(() => {
    if (formData.weekDays.length > 0 && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      calculateGeneratedAppointments(formData.weekDays, start, end);
    } else {
      setGeneratedCount(0);
    }
  }, [formData.weekDays, formData.startDate, formData.endDate]);

  const calculateGeneratedAppointments = (weekDays, startDate, endDate) => {
    if (!weekDays.length) {
      setGeneratedCount(0);
      return;
    }

    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (weekDays.includes(current.getDay())) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    setGeneratedCount(count);
  };

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleWeekDay = (dayValue) => {
    setFormData((prev) => {
      const newWeekDays = prev.weekDays.includes(dayValue)
        ? prev.weekDays.filter(d => d !== dayValue)
        : [...prev.weekDays, dayValue].sort((a, b) => a - b);
      return { ...prev, weekDays: newWeekDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.time || !formData.amount || formData.weekDays.length === 0) {
      alert('Por favor completa todos los campos y selecciona al menos un día de la semana');
      return;
    }

    // Generar todos los turnos
    const appointments = [];
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const current = new Date(startDate);

    while (current <= endDate) {
      if (formData.weekDays.includes(current.getDay())) {
        appointments.push({
          patientId: formData.patientId,
          patientName: formData.patientName,
          insurance: formData.insurance,
          amount: Number(formData.amount),
          time: formData.time,
          date: current.toISOString().split('T')[0],
          paid: false,
          recurring: true, // Marca para identificar turnos recurrentes
        });
      }
      current.setDate(current.getDate() + 1);
    }

    onSave(appointments);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Agendar Paciente Recurrente
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Programa turnos automáticos para días específicos de la semana
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
            />
            {showDropdown && filteredPatients.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto ${
                darkMode ? 'bg-slate-700' : 'bg-white border border-gray-300'
              }`}>
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatient(p)}
                    className={`w-full text-left px-3 py-2 transition ${
                      darkMode ? 'hover:bg-slate-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {p.name} ({p.dni})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Días de la Semana */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Días de la Semana *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {weekDaysOptions.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleWeekDay(day.value)}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    formData.weekDays.includes(day.value)
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day.label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiCalendar className="inline mr-1" />
                Fecha Inicio *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiCalendar className="inline mr-1" />
                Fecha Fin *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Hora y Monto */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiClock className="inline mr-1" />
                Hora *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiDollarSign className="inline mr-1" />
                Monto por Sesión *
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

          {/* Resumen */}
          {generatedCount > 0 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                📅 Se generarán <strong>{generatedCount}</strong> turnos
              </p>
              {formData.amount && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  💰 Total: <strong>${(Number(formData.amount) * generatedCount).toFixed(2)}</strong>
                </p>
              )}
            </div>
          )}

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
              disabled={generatedCount === 0}
              className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                generatedCount === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Generar {generatedCount} Turnos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}