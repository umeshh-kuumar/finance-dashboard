import React, { useContext, useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AppContext } from '../../context';

const COLORS = ['#aa3bff', '#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontWeight: '500'
};

const Piechart = () => {
    const { transactions } = useContext(AppContext);

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

    return (
        <div className="flex flex-col h-[300px] w-full">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Spending by Category</h3>
            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categorySpendingData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {categorySpendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={customTooltipStyle}
                            formatter={(value) => [`$${value}`, 'Amount']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Piechart