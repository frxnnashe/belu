// src/hooks/useFirestore.js
import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      toast.success('Registro creado exitosamente');
      return docRef.id;
    } catch (err) {
      setError(err.message);
      toast.error('Error al crear registro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const updateDocument = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, collectionName, id), data);
      toast.success('Registro actualizado');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Error al actualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Registro eliminado');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Error al eliminar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const getDocuments = useCallback(async (conditions = []) => {
    setLoading(true);
    setError(null);
    try {
      let q;
      if (conditions.length > 0) {
        q = query(collection(db, collectionName), ...conditions);
      } else {
        q = query(collection(db, collectionName));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      setError(err.message);
      toast.error('Error al obtener datos');
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    loading,
    error,
  };
};