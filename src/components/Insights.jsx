import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context';
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
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="p-2.5 bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/40 dark:to-rose-800/20 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Trophy className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Top Expense Area</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              You spent the most on <span className="font-bold text-rose-600 dark:text-rose-400">{highestCategory.name}</span> this period ({formatCurrency(highestCategory.amount)}).
            </p>
          </div>
        </div>

        {/* Insight 2: Savings Estimate */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
            <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Savings Estimate</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              Your estimated savings are <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(savings)}</span>.
            </p>
          </div>
        </div>

        {/* Insight 3: Activity summary */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
            <ReceiptText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Activity Overview</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              You have processed <span className="font-bold text-blue-600 dark:text-blue-400">{transactionCount}</span> transactions so far.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
