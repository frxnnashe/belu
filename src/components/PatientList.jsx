// src/components/PatientList.jsx
import { useState } from 'react';
import { FiTrash2, FiEdit2, FiSearch, FiPlus } from 'react-icons/fi';

export default function PatientList({
  darkMode,
  patients,
  onEdit,
  onDelete,
  onViewAppointments,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dni.includes(searchTerm)
  );

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          👥 Pacientes
        </h2>
        <button
          onClick={() => onEdit(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <FiPlus size={20} /> Nuevo
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition ${
            darkMode
              ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((patient) => (
            <div
              key={patient.id}
              className={`p-4 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {patient.name}
                  </h3>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>DNI: {patient.dni}</p>
                    <p>Teléfono: {patient.phone}</p>
                    {patient.insurance && <p>Obra Social: {patient.insurance}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewAppointments(patient.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Historial
                  </button>
                  <button
                    onClick={() => onEdit(patient)}
                    className={`p-2 rounded transition ${
                      darkMode
                        ? 'bg-slate-600 hover:bg-slate-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(patient.id)}
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
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No hay pacientes registrados
          </div>
        )}
      </div>
    </div>
  );
}