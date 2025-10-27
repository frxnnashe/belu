// src/hooks/usePatients.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const usePatients = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('patients');
  const { getDocuments: getAppointments } = useFirestore('appointments');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setPatients(data);
      setFilteredPatients(data);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = (searchTerm) => {
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const addPatient = async (patientData) => {
    const id = await addDocument(patientData);
    await fetchPatients();
    return id;
  };

  const updatePatient = async (id, patientData) => {
    await updateDocument(id, patientData);
    await fetchPatients();
  };

  const deletePatient = async (id) => {
    await deleteDocument(id);
    await fetchPatients();
  };

  const getPatientAppointments = async (patientId) => {
    return await getAppointments([where('patientId', '==', patientId)]);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    filteredPatients,
    searchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientAppointments,
    loading,
    fetchPatients,
  };
};