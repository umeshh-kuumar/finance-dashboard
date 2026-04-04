import React, { createContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

export const AppContext = createContext();

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, income, expense

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

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
        setFilterType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
