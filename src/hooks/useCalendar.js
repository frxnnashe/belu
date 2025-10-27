// src/hooks/useCalendar.js
import { useState, useMemo } from 'react';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameMonth,
  getMonthYear,
} from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentDate), [currentDate]);

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }
    return result;
  }, [daysInMonth, firstDay]);

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateForDay = (day) => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  };

  return {
    currentDate,
    days,
    daysInMonth,
    firstDay,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    getDateForDay,
    monthYear: getMonthYear(currentDate),
  };
};