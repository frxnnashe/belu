// src/pages/PatientsPage.jsx
import { useState, useEffect } from 'react';
import PatientList from '../components/PatientList';
import { useFirestore } from '../hooks/useFirestore';
import { usePatients } from '../hooks/usePatients';
import { FiX } from 'react-icons/fi';
import { formatDate } from '../utils/dateUtils';

export default function PatientsPage({ darkMode }) {
  const { addDocument, updateDocument, deleteDocument } = useFirestore('patients');
  const { patients, filteredPatients, searchPatients, loading } = usePatients();
  const { getDocuments } = useFirestore('appointments');

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    insurance: '',
    notes: '',
  });

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({ name: '', dni: '', phone: '', insurance: '', notes: '' });
    }
    setShowModal(true);
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await updateDocument(editingPatient.id, formData);
      } else {
        await addDocument(formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDeletePatient = async (id) => {
    if (confirm('¿Eliminar este paciente?')) {
      try {
        await deleteDocument(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleViewAppointments = async (patientId) => {
    const allAppointments = await getDocuments();
    const filtered = allAppointments.filter((a) => a.patientId === patientId);
    setPatientAppointments(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setShowAppointments(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <PatientList
        darkMode={darkMode}
        patients={filteredPatients}
        onEdit={handleOpenModal}
        onDelete={handleDeletePatient}
        onViewAppointments={handleViewAppointments}
      />

      {/* Modal de Paciente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-md`}>
            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-70">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
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
                  Obra Social
                </label>
                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
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
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border transition resize-none ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}

      {/* Modal de Historial */}
      {showAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto`}>
            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Historial de Turnos
              </h2>
              <button onClick={() => setShowAppointments(false)} className="hover:opacity-70">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {patientAppointments.length > 0 ? (
                patientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-lg border ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDate(apt.date)} - {apt.time}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Obra Social: {apt.insurance}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${(Number(apt.amount) || 0).toFixed(2)}</p>
                        <p className={`text-sm font-medium ${apt.paid ? 'text-green-500' : 'text-yellow-500'}`}>
                          {apt.paid ? '✓ Pagado' : '⚠ Pendiente'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No hay turnos registrados
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}