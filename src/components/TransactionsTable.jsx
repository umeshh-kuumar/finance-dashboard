import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionsTable = () => {
  const { transactions } = useContext(AppContext);

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
        {/* Step 6 placeholder: filters/search will go near here */}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
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
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
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
                  <td className={`p-4 text-sm font-bold text-right ${
                    transaction.type === 'income' 
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
                  No transactions found.
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
