import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCards = () => {
  const { transactions } = useContext(AppContext);

  // Calculate totals
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      if (t.type === 'expense') expenses += Number(t.amount);
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [transactions]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const cards = [
    {
      title: 'Total Balance',
      amount: formatCurrency(balance),
      icon: <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-900/30'
    },
    {
      title: 'Total Income',
      amount: formatCurrency(totalIncome),
      icon: <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />,
      bg: 'bg-green-50 dark:bg-green-900/30'
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totalExpenses),
      icon: <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />,
      bg: 'bg-red-50 dark:bg-red-900/30'
    }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Good Morning, Umesh! 👋</h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1.5">{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-purple-500/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            {/* Soft background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.amount}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
