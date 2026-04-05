import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context';
import { LineChart } from '@mui/x-charts/LineChart';

const getChartSx = (isDarkMode) => ({
  '& .MuiLineElement-root:nth-of-type(1)': { strokeWidth: 3 },
  '& .MuiLineElement-root:nth-of-type(2)': { strokeWidth: 3 },
  '& .MuiMarkElement-root': {
    fill: '#fff',
    strokeWidth: 2,
  },
  '& .MuiChartsAxis-bottom .MuiChartsAxis-line, & .MuiChartsAxis-left .MuiChartsAxis-line, & .MuiChartsAxis-right .MuiChartsAxis-line': {
    stroke: isDarkMode ? '#4b5563' : '#e5e7eb',
  },
  '& .MuiChartsAxis-bottom .MuiChartsAxis-tick, & .MuiChartsAxis-left .MuiChartsAxis-tick, & .MuiChartsAxis-right .MuiChartsAxis-tick': {
    stroke: isDarkMode ? '#4b5563' : '#e5e7eb',
  },
  '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel, & .MuiChartsAxis-left .MuiChartsAxis-tickLabel, & .MuiChartsAxis-right .MuiChartsAxis-tickLabel': {
    fill: '#9ca3af',
    fontSize: 12,
  },
  '& .MuiChartsGrid-vertical line': { stroke: 'transparent' },
  '& .MuiChartsGrid-horizontal line': {
    stroke: isDarkMode ? '#374151' : '#e5e7eb',
    strokeDasharray: '3 3',
  },
  '& .MuiChartsLegend-label': {
    fill: isDarkMode ? '#d1d5db' : '#6b7280',
    fontSize: '12px !important',
  },
});

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthLabel = (date) => `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

const getMonthlySeries = (transactions) => {
  const monthTotals = new Map();

  transactions.forEach(({ date, amount, type }) => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return;

    const monthKey = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
    if (!monthTotals.has(monthKey)) {
      monthTotals.set(monthKey, {
        date: parsedDate,
        income: 0,
        expense: 0,
      });
    }

    const totals = monthTotals.get(monthKey);
    if (type === 'income') totals.income += Number(amount);
    if (type === 'expense') totals.expense += Number(amount);
  });

  const sortedMonths = Array.from(monthTotals.values()).sort((a, b) => a.date - b.date);
  const labels = sortedMonths.map((item) => formatMonthLabel(item.date));
  const incomeData = sortedMonths.map((item) => item.income);
  const expenseData = sortedMonths.map((item) => item.expense);

  return { labels, incomeData, expenseData };
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-gray-400">
    No data available
  </div>
);

const BiaxialLineChart = () => {
  const { transactions, isDarkMode } = useContext(AppContext);
  const chartSx = useMemo(() => getChartSx(isDarkMode), [isDarkMode]);

  const { labels, incomeData, expenseData } = useMemo(
    () => getMonthlySeries(transactions),
    [transactions]
  );

  const series = useMemo(
    () => [
      {
        data: incomeData,
        label: 'Income',
        yAxisId: 'leftAxisId',
        color: '#aa3bff',
        valueFormatter: (v) => `₹${v.toLocaleString()}`,
      },
      {
        data: expenseData,
        label: 'Expense',
        yAxisId: 'rightAxisId',
        color: '#f97316',
        valueFormatter: (v) => `₹${v.toLocaleString()}`,
      },
    ],
    [incomeData, expenseData]
  );

  return (
    <div className="flex flex-col h-[300px]">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Income vs Expense
      </h3>
      <div className="flex-1 w-full">
        {labels.length > 0 ? (
          <LineChart
            series={series}
            xAxis={[{ scaleType: 'point', data: labels, height: 28 }]}
            yAxis={[
              {
                id: 'leftAxisId',
                width: 60,
                valueFormatter: (v) => `₹${(v / 1000).toFixed(0)}k`,
              },
              {
                id: 'rightAxisId',
                position: 'right',
                width: 60,
                valueFormatter: (v) => `₹${(v / 1000).toFixed(0)}k`,
              },
            ]}
            height={240}
            margin={{ top: 10, right: 70, bottom: 20, left: 60 }}
            slotProps={{ legend: { position: { vertical: 'top', horizontal: 'right' } } }}
            sx={chartSx}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default BiaxialLineChart;