// src/pages/ExpensesPage.jsx
import { useState, useEffect } from 'react';
import ExpenseList from '../components/ExpenseList';
import ExpenseModal from '../components/ExpenseModal';
import { useExpenses } from '../hooks/useExpenses';

export default function ExpensesPage({ darkMode }) {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);

  const { expenses, getExpensesByMonth, getTotalByMonth, addExpense, updateExpense, deleteExpense } = useExpenses();

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  useEffect(() => {
    const filtered = getExpensesByMonth(month, year);
    const total = getTotalByMonth(month, year);
    setMonthExpenses(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setMonthTotal(total);
  }, [expenses, month, year]);

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
    } else {
      setEditingExpense(null);
    }
    setShowModal(true);
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      setShowModal(false);
      setEditingExpense(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (confirm('¿Eliminar este gasto?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <ExpenseList
        darkMode={darkMode}
        expenses={expenses}
        monthExpenses={monthExpenses}
        monthTotal={monthTotal}
        onEdit={handleOpenModal}
        onDelete={handleDeleteExpense}
        onAddNew={() => handleOpenModal(null)}
      />

      <ExpenseModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </div>
  );
}