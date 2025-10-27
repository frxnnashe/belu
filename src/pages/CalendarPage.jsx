// src/pages/CalendarPage.jsx
import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TurnoModal from '../components/TurnoModal';
import RecurringPatientModal from '../components/RecurringPatientModal';
import { useFirestore } from '../hooks/useFirestore';
import { usePatients } from '../hooks/usePatients';
import { FiTrash2, FiEdit2, FiRepeat } from 'react-icons/fi';
import { formatDate } from '../utils/dateUtils';

export default function CalendarPage({ darkMode }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPerDay, setAppointmentsPerDay] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);

  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('appointments');
  const { patients } = usePatients();

  // Cargar turnos cuando cambia el mes
  useEffect(() => {
    loadAppointmentsForMonth(currentMonth);
  }, [currentMonth]);

  const loadAppointmentsForMonth = async (date) => {
    // Obtener primer y último día del mes
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const data = await getDocuments();
    
    // Filtrar turnos del mes actual
    const filteredData = data.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= firstDay && aptDate <= lastDay;
    });
    
    setAppointments(filteredData);
    groupByDay(filteredData);
  };

  const groupByDay = (data) => {
    const grouped = {};
    data.forEach((apt) => {
      const aptDate = new Date(apt.date);
      const day = aptDate.getDate();
      
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(apt);
    });
    setAppointmentsPerDay(grouped);
  };

  const handleSelectDay = (date) => {
    setSelectedDay(date);
    const day = date.getDate();
    setDayAppointments(appointmentsPerDay[day] || []);
    setEditingTurno(null);
  };

  const handleSaveTurno = async (turnoData) => {
    try {
      if (editingTurno) {
        await updateDocument(editingTurno.id, turnoData);
      } else {
        await addDocument(turnoData);
      }
      await loadAppointmentsForMonth(currentMonth);
      setShowModal(false);
      setEditingTurno(null);
    } catch (err) {
      console.error('Error guardando turno:', err);
    }
  };

  const handleSaveRecurringAppointments = async (appointmentsArray) => {
    try {
      // Guardar todos los turnos generados
      const promises = appointmentsArray.map(apt => addDocument(apt));
      await Promise.all(promises);
      
      await loadAppointmentsForMonth(currentMonth);
      setShowRecurringModal(false);
    } catch (err) {
      console.error('Error guardando turnos recurrentes:', err);
      alert('Hubo un error al generar los turnos. Por favor intenta de nuevo.');
    }
  };

  const handleDeleteTurno = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      try {
        await deleteDocument(id);
        await loadAppointmentsForMonth(currentMonth);
      } catch (err) {
        console.error('Error eliminando turno:', err);
      }
    }
  };

  const handleOpenModal = (turno = null) => {
    setEditingTurno(turno);
    setShowModal(true);
  };

  const handleOpenRecurringModal = () => {
    setShowRecurringModal(true);
  };

  // Handler para cuando cambia el mes en el calendario
  const handleMonthChange = (newDate) => {
    setCurrentMonth(newDate);
    setSelectedDay(null); // Limpiar día seleccionado al cambiar mes
    setDayAppointments([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <Calendar
            darkMode={darkMode}
            appointmentsPerDay={appointmentsPerDay}
            onSelectDay={handleSelectDay}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Panel de Turnos del Día */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6 h-fit`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedDay ? formatDate(selectedDay) : 'Selecciona un día'}
          </h3>

          {/* Botones de Acción */}
          <div className="space-y-2 mb-4">
            {selectedDay && (
              <button
                onClick={() => handleOpenModal()}
                className={`w-full py-2 rounded-lg font-medium text-white transition ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                + Nuevo Turno
              </button>
            )}
            
            <button
              onClick={handleOpenRecurringModal}
              className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <FiRepeat size={18} />
              Paciente Recurrente
            </button>
          </div>

          {/* Lista de Turnos */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {dayAppointments.length > 0 ? (
              dayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-3 rounded-lg border transition ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {apt.time}
                        </p>
                        {apt.recurring && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                            <FiRepeat className="inline" size={10} /> Fijo
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {apt.patientName}
                      </p>
                      <p className={`text-sm font-medium ${apt.paid ? 'text-green-500' : 'text-yellow-500'}`}>
                        {apt.paid ? '💰 Pagado' : '⚠️ Pendiente'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-bold text-lg mb-2">${(Number(apt.amount) || 0).toFixed(2)}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenModal(apt)}
                          className={`p-1 rounded transition ${
                            darkMode
                              ? 'bg-slate-600 hover:bg-slate-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTurno(apt.id)}
                          className={`p-1 rounded transition ${
                            darkMode
                              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedDay ? (
              <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Sin turnos este día
              </p>
            ) : (
              <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Selecciona un día para ver los turnos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Turno Individual */}
      <TurnoModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTurno}
        turno={editingTurno}
        patients={patients}
        selectedDate={selectedDay}
      />

      {/* Modal Paciente Recurrente */}
      <RecurringPatientModal
        darkMode={darkMode}
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleSaveRecurringAppointments}
        patients={patients}
        currentMonth={currentMonth}
      />
    </div>
  );
}