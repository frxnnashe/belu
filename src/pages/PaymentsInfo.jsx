// src/pages/PaymentsPage.jsx
import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { formatDate } from '../utils/dateUtils';
import { FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TurnoModal from '../components/TurnoModal';
import { usePatients } from '../hooks/usePatients';

export default function PaymentsPage({ darkMode }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [showModal, setShowModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);

  const { getDocuments, updateDocument, deleteDocument } = useFirestore('appointments');
  const { patients } = usePatients();

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filterStatus, filterMonth]);

  const loadAppointments = async () => {
    const data = await getDocuments();
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAppointments(sorted);
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (filterMonth) {
      filtered = filtered.filter((apt) => apt.date.startsWith(filterMonth));
    }

    if (filterStatus !== 'todos') {
      const isPaid = filterStatus === 'pagados';
      filtered = filtered.filter((apt) => apt.paid === isPaid);
    }

    setFilteredAppointments(filtered);
  };

  const handleSave = async (turnoData) => {
    try {
      if (editingTurno) {
        await updateDocument(editingTurno.id, turnoData);
      }
      await loadAppointments();
      setShowModal(false);
      setEditingTurno(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      try {
        await deleteDocument(id);
        await loadAppointments();
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const stats = {
    total: filteredAppointments.reduce((sum, a) => sum + (a.amount || 0), 0),
    paid: filteredAppointments
      .filter((a) => a.paid)
      .reduce((sum, a) => sum + (a.amount || 0), 0),
    pending: filteredAppointments
      .filter((a) => !a.paid)
      .reduce((sum, a) => sum + (a.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Facturado
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ${stats.total.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Cobrado
          </p>
          <p className={`text-3xl font-bold mt-2 text-green-500`}>
            ${stats.paid.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Pendiente
          </p>
          <p className={`text-3xl font-bold mt-2 text-yellow-500`}>
            ${stats.pending.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div
        className={`p-4 rounded-lg shadow-lg ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiFilter size={20} />
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Filtros
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="todos">Todos</option>
              <option value="pagados">Pagados</option>
              <option value="pendientes">Pendientes</option>
            </select>
          </div>

          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mes
            </label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Lista de Turnos */}
      <div
        className={`p-6 rounded-lg shadow-lg ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Movimientos de Pago
        </h2>

        <div className="space-y-2">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 rounded-lg border flex justify-between items-center transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${apt.paid ? '💰' : '⚠️'}`}></span>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {apt.patientName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(apt.date)} - {apt.time}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {apt.insurance}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">${apt.amount.toFixed(2)}</p>
                    <p
                      className={`text-sm font-medium ${
                        apt.paid ? 'text-green-500' : 'text-yellow-500'
                      }`}
                    >
                      {apt.paid ? '✓ Pagado' : '✗ Pendiente'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTurno(apt);
                        setShowModal(true);
                      }}
                      className={`p-2 rounded transition ${
                        darkMode
                          ? 'bg-slate-600 hover:bg-slate-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(apt.id)}
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
              </div>
            ))
          ) : (
            <div
              className={`text-center py-12 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No hay turnos para mostrar
            </div>
          )}
        </div>
      </div>

      <TurnoModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTurno(null);
        }}
        onSave={handleSave}
        turno={editingTurno}
        patients={patients}
      />
    </div>
  );
}