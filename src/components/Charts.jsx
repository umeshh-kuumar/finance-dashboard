import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  BarChart, Bar, Tooltip as BarTooltip, Legend, Cell
} from 'recharts';

const COLORS = ['#aa3bff', '#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const Charts = () => {
  const { transactions } = useContext(AppContext);

  // Prepare data for Balance Trend (Line Chart)
  const balanceTrendData = useMemo(() => {
    // Sort transactions by date first
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    
    // Group by date to handle multiple transactions per day
    const groupedByDate = {};
    
    sorted.forEach(t => {
      if (!groupedByDate[t.date]) {
        groupedByDate[t.date] = { date: t.date, net: 0 };
      }
      const amt = Number(t.amount);
      groupedByDate[t.date].net += t.type === 'income' ? amt : -amt;
    });

    return Object.values(groupedByDate).map(day => {
      currentBalance += day.net;
      return {
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: currentBalance
      };
    });
  }, [transactions]);

  // Prepare data for Spending by Category (Bar Chart)
  const categorySpendingData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    
    expenses.forEach(t => {
      if (!grouped[t.category]) {
        grouped[t.category] = 0;
      }
      grouped[t.category] += Number(t.amount);
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [transactions]);

  // Custom tooltips styling
  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontWeight: '500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Balance Trend */}
      <div className="flex flex-col h-[300px] w-full">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Balance Trend</h3>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              <LineTooltip contentStyle={customTooltipStyle} formatter={(value) => [`$${value}`, 'Balance']} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#aa3bff" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#aa3bff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="flex flex-col h-[300px] w-full">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Spending by Category</h3>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorySpendingData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                width={80}
              />
              <BarTooltip contentStyle={customTooltipStyle} cursor={{ fill: 'transparent' }} formatter={(value) => [`$${value}`, 'Amount']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {categorySpendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
