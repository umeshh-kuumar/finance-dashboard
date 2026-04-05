import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';
import { AppContext } from './context';

export const AppProvider = ({ children }) => {
  // Load data from localStorage or use mockData
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) return JSON.parse(saved);
    return mockTransactions;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance_role') || 'Admin'; // Default role Admin for now
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('finance_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, income, expense
  const [activePage, setActivePage] = useState('dashboard');

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        role,
        setRole,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        isDarkMode,
        setIsDarkMode,
        activePage,
        setActivePage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
