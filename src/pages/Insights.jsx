import React, { useContext, useMemo } from "react";
import { AppContext } from "../context";
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
} from "recharts";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";

const COLORS = ["#aa3bff", "#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

// ── Reusable card wrapper ──────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] border border-white/20 dark:border-gray-700/50 p-6 ${className}`}>
    {children}
  </div>
);

// ── Metric card ────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, colorClass }) => (
  <Card>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</h3>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </Card>
);

// ── Shared tooltip styles hook ─────────────────────────────────────────────
const useTooltipStyle = (isDarkMode) =>
  useMemo(() => ({
    backgroundColor: isDarkMode ? "rgba(31,41,55,0.95)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
    borderRadius: "0.75rem",
    boxShadow: `0 4px 6px -1px rgba(0,0,0,${isDarkMode ? 0.3 : 0.1})`,
    fontWeight: "500",
    color: isDarkMode ? "#f9fafb" : "#111827",
  }), [isDarkMode]);

// ── Shared axis tick style ─────────────────────────────────────────────────
const axisTick = { fontSize: 12, fill: "#9ca3af" };

const Insights = () => {
  const { transactions, isDarkMode } = useContext(AppContext);
  const tooltipStyle = useTooltipStyle(isDarkMode);

  // ── Single pass over transactions for all derived data ──────────────────
  const { insights, categorySpendingData } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalExpenses = 0;
    let totalIncome = 0;
    const spendingByCategory = {};
    const categorySpendingRaw = {};

    // Build last-6-months buckets in one pass
    const monthBuckets = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthBuckets[key] = {
        month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: 0,
        expenses: 0,
      };
    }

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const tMonth = date.getMonth();
      const tYear = date.getFullYear();
      const amount = Number(t.amount);
      const bucketKey = `${tYear}-${tMonth}`;

      // Monthly 6-month rolling buckets
      if (monthBuckets[bucketKey]) {
        if (t.type === "income") monthBuckets[bucketKey].income += amount;
        else monthBuckets[bucketKey].expenses += amount;
      }

      // Current-month totals + category breakdown
      if (tMonth === currentMonth && tYear === currentYear) {
        if (t.type === "expense") {
          totalExpenses += amount;
          spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + amount;
        } else {
          totalIncome += amount;
        }
      }

      // All-time category spending for bar chart
      if (t.type === "expense") {
        categorySpendingRaw[t.category] = (categorySpendingRaw[t.category] || 0) + amount;
      }
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const categoryData = Object.entries(spendingByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const categorySpendingData = Object.entries(categorySpendingRaw)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      insights: {
        totalExpenses,
        totalIncome,
        categoryData,
        avgDailyExpense: totalExpenses / daysInMonth,
        savingRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        monthlyData: Object.values(monthBuckets),
      },
      categorySpendingData,
    };
  }, [transactions]);

  const muiChartHeight = Math.max(200, categorySpendingData.length * 48);

  const metrics = [
    { label: "Total Income",      value: formatINR(insights.totalIncome),      colorClass: "text-green-600 dark:text-green-400" },
    { label: "Total Expenses",    value: formatINR(insights.totalExpenses),     colorClass: "text-red-600 dark:text-red-400" },
    { label: "Avg Daily Expense", value: formatINR(insights.avgDailyExpense),   colorClass: "text-blue-600 dark:text-blue-400" },
    {
      label: "Saving Rate",
      value: `${insights.savingRate.toFixed(1)}%`,
      colorClass: insights.savingRate >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze your spending patterns and financial health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Monthly Income vs Expenses */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Income vs Expenses
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={insights.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTick} />
              <YAxis axisLine={false} tickLine={false} tick={axisTick} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [formatINR(value), name === "income" ? "Income" : "Expenses"]}
              />
              <Legend />
              <Bar dataKey="income"   fill="#10b981" name="Income"   radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Category list */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
          {insights.categoryData.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No expense data this month.</p>
          ) : (
            <div className="space-y-3">
              {insights.categoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatINR(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Category bar chart */}
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Spending by Category</h3>
          {categorySpendingData.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No expense data available.</p>
          ) : (
            <div style={{ height: muiChartHeight }}>
              <MuiBarChart
                layout="horizontal"
                dataset={categorySpendingData}
                yAxis={[{
                  scaleType: "band",
                  dataKey: "name",
                  tickLabelStyle: { fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6b7280" },
                }]}
                xAxis={[{
                  valueFormatter: (v) => `₹${v}`,
                  tickLabelStyle: { fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6b7280" },
                }]}
                series={[{
                  dataKey: "value",
                  label: "Amount",
                  valueFormatter: (v) => formatINR(v),
                }]}
                colors={COLORS}
                borderRadius={4}
                height={muiChartHeight}
                margin={{ top: 5, right: 20, left: 90, bottom: 5 }}
                slotProps={{ legend: { hidden: true } }}
                sx={{
                  width: "100%",
                  "& .MuiChartsAxis-line": { display: "none" },
                  "& .MuiChartsAxis-tick": { display: "none" },
                  "& .MuiChartsGrid-line": {
                    stroke: isDarkMode ? "#374151" : "#e5e7eb",
                    strokeDasharray: "3 3",
                  },
                }}
              />
            </div>
          )}
        </Card>

      </div>
    </main>
  );
};

export default Insights;