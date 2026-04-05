import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context';
import { ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const TransactionsTable = () => {
  const { transactions, searchTerm, setSearchTerm, filterType, setFilterType, role } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Handle Sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const processedTransactions = useMemo(() => {
    let processed = [...transactions];

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      processed = processed.filter(t =>
        t.category.toLowerCase().includes(lowerSearch) ||
        t.amount.toString().includes(lowerSearch)
      );
    }

    // Filter by Type
    if (filterType !== 'All') {
      processed = processed.filter(t => t.type === filterType.toLowerCase());
    }

    // Sort
    processed.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortConfig.key === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });

    return processed;
  }, [transactions, searchTerm, filterType, sortConfig]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] border border-white/20 dark:border-gray-700/50 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100/50 dark:border-gray-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          {role === 'Admin' && (
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all duration-300">
              + Add Transaction
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all text-gray-800 dark:text-gray-200"
            />
          </div>

          <div className="relative flex items-center">
            <SlidersHorizontal className="absolute left-3 h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm appearance-none text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
              <th
                className="p-4 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'date' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} transition-opacity`} />
                </div>
              </th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Type</th>
              <th
                className="p-4 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none flex justify-end items-center gap-1"
                onClick={() => requestSort('amount')}
              >
                <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === 'amount' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} transition-opacity`} />
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {processedTransactions.length > 0 ? (
              processedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.category}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className={`p-4 text-sm font-bold text-right ${transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-900 dark:text-white'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No matching transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
