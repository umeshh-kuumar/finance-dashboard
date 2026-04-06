import React, { useContext, useMemo } from "react";
import { AppContext } from "../../context";
import { PieChart } from "@mui/x-charts/PieChart";

const COLORS = [
  "#aa3bff",
  "#4f46e5",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

const getChartSx = (isDarkMode) => ({
  "& .MuiChartsLegend-label": {
    fill: isDarkMode ? "#d1d5db" : "#6b7280",
    fontSize: "12px !important",
  },
  "& .MuiChartsTooltip-root": {
    backgroundColor: isDarkMode
      ? "rgba(31, 41, 55, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    color: isDarkMode ? "#f9fafb" : "#111827",
    fontWeight: 500,
  },
});

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-gray-400">
    No data available
  </div>
);

const Piechart = () => {
  const { transactions, isDarkMode } = useContext(AppContext);
  const chartSx = useMemo(() => getChartSx(isDarkMode), [isDarkMode]);

  const categorySpendingData = useMemo(() => {
    const grouped = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] ?? 0) + Number(amount);
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([label, value], index) => ({
        id: index,
        label,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = useMemo(
    () => categorySpendingData.reduce((s, d) => s + d.value, 0),
    [categorySpendingData]
  );

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Spending by Category
      </h3>

      {categorySpendingData.length > 0 ? (
        <div className="flex justify-around flex-row items-center  w-full gap-2">

          {/* ── Pie (left) ── */}
          <div className="flex-shrink-0">
            <PieChart
              series={[
                {
                  data: categorySpendingData,
                  innerRadius: 40,
                  cx: 110,
                  cy: 110,
                  arcLabel: (p) =>
                    `${((p.value / total) * 100).toFixed(0)}%`,
                  arcLabelMinAngle: 20,
                  valueFormatter: ({ value }) =>
                    `₹${value.toLocaleString()}`,
                },
              ]}
              width={235}
              height={235}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              sx={chartSx}
              slotProps={{ legend: { hidden: true } }} // 👈 hide built-in legend
            />
          </div>


          <div className="flex flex-col flex-wrap  ml-4 max-h-52 overflow-hidden">
            {categorySpendingData.map((item) => (
              <div key={item.id} className="flex items-center gap-2 min-w-[120px]">
                <span
                  className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Piechart;
