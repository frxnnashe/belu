// src/utils/dateUtils.js
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const formatMonth = (date) => {
  return format(date, 'MMMM yyyy', { locale: es });
};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const getMonthYear = (date) => {
  return { month: date.getMonth(), year: date.getFullYear() };
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isSameMonth = (date1, date2) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getDateString = (year, month, day) => {
  return new Date(year, month, day).toISOString().split('T')[0];
};