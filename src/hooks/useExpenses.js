// src/hooks/useExpenses.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where, and } from 'firebase/firestore';
import { getMonthYear } from '../utils/dateUtils';

export const useExpenses = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('expenses');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } finally {
      setLoading(false);
    }
  };

  const getExpensesByMonth = (month, year) => {
    return expenses.filter((e) => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === month && eDate.getFullYear() === year;
    });
  };

  const getTotalByMonth = (month, year) => {
    return getExpensesByMonth(month, year).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  };

  const getExpensesByCategory = (category, month, year) => {
    return getExpensesByMonth(month, year).filter((e) => e.category === category);
  };

  const addExpense = async (expenseData) => {
    const id = await addDocument(expenseData);
    await fetchExpenses();
    return id;
  };

  const updateExpense = async (id, expenseData) => {
    await updateDocument(id, expenseData);
    await fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await deleteDocument(id);
    await fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    getExpensesByMonth,
    getTotalByMonth,
    getExpensesByCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    loading,
  };
};