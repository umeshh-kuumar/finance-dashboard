import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context";
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";
import ReactDOM from 'react-dom';

const INITIAL_FORM = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  category: "Salary",
  type: "income",
};

const TransactionsTable = () => {
  const {
    transactions,
    setTransactions,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    role,
  } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.date || !formData.category) {
      alert("Please fill all fields");
      return;
    }

    const newId = transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1;

    const newTransaction = {
      id: newId,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
    };

    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
    setFormData(INITIAL_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))].sort(),
    [transactions],
  );

  const processedTransactions = useMemo(() => {
    let processed = [...transactions];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      processed = processed.filter(
        (t) =>
          t.category.toLowerCase().includes(lower) ||
          t.amount.toString().includes(lower),
      );
    }

    if (filterType !== "All") {
      processed = processed.filter((t) => t.type === filterType.toLowerCase());
    }

    if (filterCategory !== "All") {
      processed = processed.filter((t) => t.category === filterCategory);
    }

    if (startDate) {
      const start = new Date(startDate);
      processed = processed.filter((t) => new Date(t.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      processed = processed.filter((t) => new Date(t.date) <= end);
    }

    processed.sort((a, b) => {
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    return processed;
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCategory,
    startDate,
    endDate,
    sortConfig,
  ]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] border border-white/20 dark:border-gray-700/50 overflow-hidden w-full">
      {/* ── Header ── */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100/50 dark:border-gray-700/50 flex flex-col gap-4">
        {/* Title + Add button row */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
            Recent Transactions
          </h2>

          {role === "Admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              + Add Transaction
            </button>
          )}
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Type Filter */}
          <div className="relative flex-shrink-0">
            {/* FIX: added top-1/2 -translate-y-1/2 for proper vertical centering */}
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm appearance-none text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative flex-shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm appearance-none text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
          />

          {/* End Date */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
          />
        </div>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
              <th
                className="p-4 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown
                    className={`w-3 h-3 transition-opacity ${sortConfig.key === "date" ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                  />
                </div>
              </th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Type</th>
              <th
                className="p-4 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none text-right"
                onClick={() => requestSort("amount")}
              >
                <div className="flex items-center justify-end gap-1">
                  <ArrowUpDown
                    className={`w-3 h-3 transition-opacity ${sortConfig.key === "amount" ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                  />
                  Amount
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {processedTransactions.length > 0 ? (
              processedTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    {t.category}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {t.type === "income" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-sm font-bold text-right whitespace-nowrap ${
                      t.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No matching transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {processedTransactions.length > 0 ? (
          processedTransactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    t.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {t.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t.category}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(t.date)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`text-sm font-bold ${
                    t.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    t.type === "income"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No matching transactions found.
          </div>
        )}
      </div>

      {/* ── Add Transaction Modal ── */}
      {showModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
              {/* Header — always visible, never scrolls */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Add Transaction
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body — only this part scrolls */}
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-200 appearance-none cursor-pointer"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g., Salary, Food, Rent"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-200"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTransaction}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Add Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body, // 👈 renders outside the overflow-hidden parent
        )}
    </div>
  );
};

export default TransactionsTable;
