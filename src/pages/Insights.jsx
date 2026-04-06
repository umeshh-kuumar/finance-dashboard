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
import { TrendingUp, TrendingDown, Calendar, PiggyBank } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#aa3bff",
  "#4f46e5",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

const formatINR = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const axisTick = { fontSize: 11, fill: "#9ca3af" };

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(170,59,255,0.06)] ${className}`}
  >
    {children}
  </div>
);

// ─── Metric Card ──────────────────────────────────────────────────────────────

const METRIC_CONFIG = {
  income: {
    icon: TrendingUp,
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon_color: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  expense: {
    icon: TrendingDown,
    bg: "bg-rose-50 dark:bg-rose-500/10",
    icon_color: "text-rose-500",
    bar: "bg-rose-500",
  },
  daily: {
    icon: Calendar,
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon_color: "text-blue-500",
    bar: "bg-blue-500",
  },
  saving: {
    icon: PiggyBank,
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon_color: "text-purple-500",
    bar: "bg-purple-500",
  },
};

const MetricCard = ({ label, value, variant, trend, trendLabel }) => {
  const cfg = METRIC_CONFIG[variant];
  const Icon = cfg.icon;
  return (
    <Card className="p-5 flex flex-col gap-4 group hover:-translate-y-0.5 transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
          <Icon className={`w-4 h-4 ${cfg.icon_color}`} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-lg
            ${
              trend >= 0
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums leading-none">
          {value}
        </p>
        {trendLabel && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            {trendLabel}
          </p>
        )}
      </div>
      {/* bottom accent bar */}
      <div
        className={`h-0.5 w-full rounded-full ${cfg.bar} opacity-20 group-hover:opacity-40 transition-opacity`}
      />
    </Card>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h3 className="text-base font-bold text-gray-900 dark:text-white">
      {title}
    </h3>
    {subtitle && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
        {subtitle}
      </p>
    )}
  </div>
);

// ─── Category Row with progress bar ──────────────────────────────────────────

const CategoryRow = ({ item, index, max }) => {
  const pct = max > 0 ? (item.amount / max) * 100 : 0;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {item.category}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums ml-4 flex-shrink-0">
          {formatINR(item.amount)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: COLORS[index % COLORS.length],
          }}
        />
      </div>
    </div>
  );
};

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className={`px-4 py-3 rounded-xl border text-sm shadow-xl
      ${
        isDarkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <p className="font-semibold mb-2 text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="text-xs font-medium">{entry.name}:</span>
          <span className="text-xs font-bold tabular-nums">
            {formatINR(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const Empty = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <PiggyBank className="w-5 h-5 text-gray-300 dark:text-gray-600" />
    </div>
    <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Insights = () => {
  const { transactions, isDarkMode } = useContext(AppContext);

  const { insights, categorySpendingData } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalExpenses = 0;
    let totalIncome = 0;
    const spendingByCategory = {};
    const categorySpendingRaw = {};

    const monthBuckets = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthBuckets[key] = {
        month: d.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
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

      if (monthBuckets[bucketKey]) {
        if (t.type === "income") monthBuckets[bucketKey].income += amount;
        else monthBuckets[bucketKey].expenses += amount;
      }

      if (tMonth === currentMonth && tYear === currentYear) {
        if (t.type === "expense") {
          totalExpenses += amount;
          spendingByCategory[t.category] =
            (spendingByCategory[t.category] || 0) + amount;
        } else {
          totalIncome += amount;
        }
      }

      if (t.type === "expense") {
        categorySpendingRaw[t.category] =
          (categorySpendingRaw[t.category] || 0) + amount;
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
        avgDailyExpense: daysInMonth > 0 ? totalExpenses / daysInMonth : 0,
        savingRate:
          totalIncome > 0
            ? ((totalIncome - totalExpenses) / totalIncome) * 100
            : 0,
        monthlyData: Object.values(monthBuckets),
      },
      categorySpendingData,
    };
  }, [transactions]);

  const muiChartHeight = Math.max(220, categorySpendingData.length * 52);
  const maxCategoryAmount = insights.categoryData[0]?.amount ?? 1;

  const tooltipSx = {
    "& .MuiChartsAxis-line": { display: "none" },
    "& .MuiChartsAxis-tick": { display: "none" },
    "& .MuiChartsGrid-line": {
      stroke: isDarkMode ? "#1f2937" : "#f3f4f6",
      strokeDasharray: "4 4",
    },
    "& .MuiChartsTooltip-paper": {
      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
      borderRadius: "12px",
      color: isDarkMode ? "#f9fafb" : "#111827",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    },
    width: "100%",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Page heading ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Financial Insights
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            · all-time trends
          </p>
        </div>
      </div>

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Income"
          value={formatINR(insights.totalIncome)}
          variant="income"
          trendLabel="This month"
        />
        <MetricCard
          label="Total Expenses"
          value={formatINR(insights.totalExpenses)}
          variant="expense"
          trendLabel="This month"
        />
        <MetricCard
          label="Avg Daily Spend"
          value={formatINR(insights.avgDailyExpense)}
          variant="daily"
          trendLabel="Per day this month"
        />
        <MetricCard
          label="Saving Rate"
          value={`${insights.savingRate.toFixed(1)}%`}
          variant="saving"
          trend={insights.savingRate}
          trendLabel="Of total income"
        />
      </div>

      {/* ── Monthly chart ── */}
      <Card className="p-6">
        <SectionHeader
          title="Income vs Expenses"
          subtitle="Last 6 months comparison"
        />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={insights.monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={axisTick}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                tickFormatter={(v) =>
                  v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                }
                width={48}
              />
              <Tooltip
                content={(props) => (
                  <CustomTooltip {...props} isDarkMode={isDarkMode} />
                )}
                cursor={{
                  fill: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
                  radius: 8,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                formatter={(v) => (
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {v}
                  </span>
                )}
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Income"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                name="Expenses"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Bottom grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown list */}
        <Card className="p-6">
          <SectionHeader
            title="Spending by Category"
            subtitle="Current month breakdown"
          />
          {insights.categoryData.length === 0 ? (
            <Empty message="No expense data this month" />
          ) : (
            <div className="space-y-4">
              {insights.categoryData.map((item, index) => (
                <CategoryRow
                  key={item.category}
                  item={item}
                  index={index}
                  max={maxCategoryAmount}
                />
              ))}
            </div>
          )}
        </Card>

        {/* MUI bar chart */}
        <Card className="p-6">
          <SectionHeader
            title="All-time Category Spending"
            subtitle="Cumulative expenses per category"
          />
          {categorySpendingData.length === 0 ? (
            <Empty message="No expense data available" />
          ) : (
            <div style={{ height: muiChartHeight }}>
              <MuiBarChart
                layout="horizontal"
                dataset={categorySpendingData}
                yAxis={[
                  {
                    scaleType: "band",
                    dataKey: "name",
                    tickLabelStyle: {
                      fontSize: 11,
                      fill: isDarkMode ? "#9ca3af" : "#6b7280",
                    },
                  },
                ]}
                xAxis={[
                  {
                    valueFormatter: (v) =>
                      v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
                    tickLabelStyle: {
                      fontSize: 11,
                      fill: isDarkMode ? "#9ca3af" : "#6b7280",
                    },
                  },
                ]}
                series={[
                  {
                    dataKey: "value",
                    label: "Amount",
                    valueFormatter: (v) => formatINR(v),
                  },
                ]}
                colors={COLORS}
                borderRadius={6}
                height={muiChartHeight}
                margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                slotProps={{ legend: { hidden: true } }}
                sx={tooltipSx}
              />
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default Insights;
