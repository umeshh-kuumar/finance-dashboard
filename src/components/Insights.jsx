import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Trophy, PiggyBank, ReceiptText } from 'lucide-react';

const Insights = () => {
  const { transactions } = useContext(AppContext);

  // Calculate insights
  const { highestCategory, savings, transactionCount } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryTotals = {};

    transactions.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        income += amt;
      } else {
        expenses += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      }
    });

    let maxCat = { name: 'None', amount: 0 };
    for (const [name, amount] of Object.entries(categoryTotals)) {
      if (amount > maxCat.amount) {
        maxCat = { name, amount };
      }
    }

    return {
      highestCategory: maxCat,
      savings: income - expenses,
      transactionCount: transactions.length
    };
  }, [transactions]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Insights</h3>
      </div>
      
      <div className="flex-1 space-y-4">
        {/* Insight 1: Highest Spending Category */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg shrink-0">
            <Trophy className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Top Expense Area</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              You spent the most on <span className="font-bold text-rose-600 dark:text-rose-400">{highestCategory.name}</span> this period ({formatCurrency(highestCategory.amount)}).
            </p>
          </div>
        </div>

        {/* Insight 2: Savings Estimate */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
            <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Savings Estimate</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              Your estimated savings are <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(savings)}</span>.
            </p>
          </div>
        </div>

        {/* Insight 3: Activity summary */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
            <ReceiptText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Activity Overview</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              You have processed <span className="font-bold text-blue-600 dark:text-blue-400">{transactionCount}</span> transactions so far.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
