import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const COLORS = ['#aa3bff', '#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const Insights = () => {
    const { transactions } = useContext(AppContext);

    // Calculate insights
    const insights = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter transactions for current month
        const monthlyTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const expenses = monthlyTransactions.filter(t => t.type === 'expense');
        const incomes = monthlyTransactions.filter(t => t.type === 'income');

        const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);

        // Total spending by category
        const spendingByCategory = {};
        expenses.forEach(t => {
            spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + Number(t.amount);
        });
        const categoryData = Object.entries(spendingByCategory)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);

        // Average daily expense (for current month)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const avgDailyExpense = totalExpenses / daysInMonth;

        // Saving rate
        const savingRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        // Monthly income and expenses for the last 6 months
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });

            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);
            const monthExpense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            monthlyData.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                income: monthIncome,
                expenses: monthExpense
            });
        }

        return {
            totalExpenses,
            totalIncome,
            categoryData,
            avgDailyExpense,
            savingRate,
            monthlyData
        };
    }, [transactions]);

    const customTooltipStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontWeight: '500'
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Insights</h1>
                <p className="text-gray-600 dark:text-gray-400">Analyze your spending patterns and financial health</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Income</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${insights.totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Expenses</h3>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">${insights.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Avg Daily Expense</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${insights.avgDailyExpense.toFixed(2)}</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Saving Rate</h3>
                    <p className={`text-2xl font-bold ${insights.savingRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {insights.savingRate.toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending by Category */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
                    <div className="space-y-3">
                        {insights.categoryData.map((item, index) => (
                            <div key={item.category} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">${item.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Income vs Expenses Chart */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Income vs Expenses</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={insights.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={customTooltipStyle}
                                    formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : 'Expenses']}
                                />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Insights;