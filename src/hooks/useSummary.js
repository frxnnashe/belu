// src/hooks/useSummary.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';

export const useSummary = () => {
  const { getDocuments: getAppointments } = useFirestore('appointments');
  const { getDocuments: getExpenses } = useFirestore('expenses');
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalPaid: 0,
    totalPending: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);

  const calculateMonthlySummary = async (month, year) => {
    setLoading(true);
    try {
      const appointments = await getAppointments();
      const expenses = await getExpenses();

      const monthAppointments = appointments.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });

      const monthExpenses = expenses.filter((e) => {
        const date = new Date(e.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });

      const totalIncome = monthAppointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const totalPaid = monthAppointments
        .filter((a) => a.paid)
        .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const totalPending = totalIncome - totalPaid;
      const totalExpenses = monthExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const balance = totalPaid - totalExpenses;

      setSummary({
        totalIncome,
        totalPaid,
        totalPending,
        totalExpenses,
        balance,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    calculateMonthlySummary,
    loading,
  };
};