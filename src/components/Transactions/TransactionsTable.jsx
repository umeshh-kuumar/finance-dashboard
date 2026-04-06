import React, { useContext, useState, useMemo, useCallback } from "react";
import { AppContext } from "../../context";
import {
  ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal,
  ArrowUpDown, X, Edit2, Trash2, Download, Plus, AlertTriangle,
} from "lucide-react";
import ReactDOM from "react-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  category: "",
  type: "income",
};

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

const formatDate = (s) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// ─── Type Badge ───────────────────────────────────────────────────────────────

const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide
    ${type === "income"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20"
      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-500/20"
    }`}>
    {type === "income"
      ? <ArrowUpRight className="w-3 h-3" />
      : <ArrowDownRight className="w-3 h-3" />}
    {type.charAt(0).toUpperCase() + type.slice(1)}
  </span>
);

// ─── Form Field ───────────────────────────────────────────────────────────────

const inputCls = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";

const FormField = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ onConfirm, onCancel }) => (
  <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-3 py-2">
    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
    <span className="text-xs text-rose-700 dark:text-rose-400 font-medium flex-1">Delete this?</span>
    <button onClick={onConfirm} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors px-1">Yes</button>
    <span className="text-rose-300 dark:text-rose-700">·</span>
    <button onClick={onCancel} className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors px-1">No</button>
  </div>
);

// ─── Shared Transaction Modal ─────────────────────────────────────────────────

const TransactionModal = ({ mode, formData, onChange, onSubmit, onClose }) => {
  const isEdit = mode === "edit";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 w-full max-w-md flex flex-col max-h-[90vh] border border-gray-200/80 dark:border-gray-700/60">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {isEdit ? "Edit Transaction" : "New Transaction"}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isEdit ? "Update the details below" : "Fill in the details below"}
            </p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Type toggle — pill switcher instead of a dropdown */}
          <FormField label="Type">
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900/60 gap-1">
              {["income", "expense"].map((t) => (
                <button key={t} type="button"
                  onClick={() => onChange({ target: { name: "type", value: t } })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200
                    ${formData.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                        : "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}>
                  {t === "income" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Date">
            <input type="date" name="date" value={formData.date} onChange={onChange} className={inputCls} />
          </FormField>

          <FormField label="Category">
            <input type="text" name="category" placeholder="e.g. Salary, Rent, Food"
              value={formData.category} onChange={onChange} className={inputCls} />
          </FormField>

          <FormField label="Amount (₹)">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">₹</span>
              <input type="number" name="amount" placeholder="0.00" min="0" step="0.01"
                value={formData.amount} onChange={onChange}
                className={`${inputCls} pl-7`} />
            </div>
          </FormField>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-px active:translate-y-0 transition-all duration-200">
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── Filter Bar Input ─────────────────────────────────────────────────────────

const filterInputCls = "py-2 px-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer appearance-none transition-all";

// ─── Main Component ───────────────────────────────────────────────────────────

const TransactionsTable = () => {
  const { transactions, setTransactions, searchTerm, setSearchTerm, filterType, setFilterType, role } = useContext(AppContext);

  const [sortConfig, setSortConfig]     = useState({ key: "date", direction: "desc" });
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [modal, setModal]               = useState(null); // null | 'add' | 'edit'
  const [formData, setFormData]         = useState(INITIAL_FORM);
  const [editingId, setEditingId]       = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const closeModal = useCallback(() => {
    setModal(null);
    setEditingId(null);
    setFormData(INITIAL_FORM);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.amount || !formData.date || !formData.category) {
      alert("Please fill all fields");
      return;
    }
    if (modal === "add") {
      const newId = transactions.reduce((m, t) => Math.max(m, t.id), 0) + 1;
      setTransactions([{ id: newId, ...formData, amount: parseFloat(formData.amount) }, ...transactions]);
    } else {
      setTransactions(transactions.map((t) =>
        t.id === editingId ? { ...t, ...formData, amount: parseFloat(formData.amount) } : t
      ));
    }
    closeModal();
  }, [modal, formData, transactions, editingId, setTransactions, closeModal]);

  const openEdit = useCallback((t) => {
    setEditingId(t.id);
    setFormData({ date: t.date, amount: t.amount.toString(), category: t.category, type: t.type });
    setModal("edit");
  }, []);

  const confirmDelete = useCallback((id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setPendingDeleteId(null);
  }, [transactions, setTransactions]);

  const exportCSV = useCallback(() => {
    const esc = (v) => {
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes("\n") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const headers = ["id", "date", "category", "type", "amount"];
    const csv = [headers, ...processedTransactions.map((t) => [t.id, t.date, t.category, t.type, t.amount])]
      .map((r) => r.map(esc).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }, []);

  // Lock body scroll when modal open
  React.useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  // ── Derived data ─────────────────────────────────────────────────────────────

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))].sort(),
    [transactions]
  );

  const processedTransactions = useMemo(() => {
    let out = [...transactions];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      out = out.filter((t) => t.category.toLowerCase().includes(q) || t.amount.toString().includes(q));
    }
    if (filterType !== "All")     out = out.filter((t) => t.type === filterType.toLowerCase());
    if (filterCategory !== "All") out = out.filter((t) => t.category === filterCategory);
    if (startDate) out = out.filter((t) => new Date(t.date) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate); end.setHours(23, 59, 59, 999);
      out = out.filter((t) => new Date(t.date) <= end);
    }
    out.sort((a, b) =>
      sortConfig.key === "amount"
        ? sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
        : sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
    );
    return out;
  }, [transactions, searchTerm, filterType, filterCategory, startDate, endDate, sortConfig]);

  const SortTh = ({ col, children, className = "" }) => (
    <th onClick={() => setSortConfig((p) => ({ key: col, direction: p.key === col && p.direction === "asc" ? "desc" : "asc" }))}
      className={`p-4 font-semibold cursor-pointer select-none group hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}>
      <div className={`flex items-center gap-1 ${className.includes("text-right") ? "justify-end" : ""}`}>
        {children}
        <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig.key === col ? "opacity-100 text-purple-500" : "opacity-0 group-hover:opacity-40"}`} />
      </div>
    </th>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.06)] border border-gray-200/60 dark:border-gray-700/40 overflow-hidden w-full">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800/80 space-y-4">

        {/* Title row */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Transactions</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {processedTransactions.length} of {transactions.length} entries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            {role === "Admin" && (
              <button onClick={() => setModal("add")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-px active:translate-y-0 transition-all duration-200">
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 w-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 dark:text-gray-200 transition-all" />
          </div>

          {/* Type */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none z-10" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`${filterInputCls} pl-8 pr-7`}>
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${filterInputCls} px-3 pr-7`}>
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Date range */}
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={filterInputCls} />
          <input type="date" value={endDate}   onChange={(e) => setEndDate(e.target.value)}   className={filterInputCls} />
        </div>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 text-xs border-b border-gray-100 dark:border-gray-800">
              <SortTh col="date">Date</SortTh>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Type</th>
              <SortTh col="amount" className="text-right">Amount</SortTh>
              {role === "Admin" && <th className="p-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {processedTransactions.length > 0 ? (
              processedTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-purple-50/30 dark:hover:bg-purple-500/5 transition-colors duration-100">
                  <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.category}</span>
                  </td>
                  <td className="px-4 py-3.5"><TypeBadge type={t.type} /></td>
                  <td className={`px-4 py-3.5 text-sm font-bold text-right whitespace-nowrap tabular-nums
                    ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  {role === "Admin" && (
                    <td className="px-4 py-3.5 text-right">
                      {pendingDeleteId === t.id ? (
                        <DeleteConfirm onConfirm={() => confirmDelete(t.id)} onCancel={() => setPendingDeleteId(null)} />
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setPendingDeleteId(t.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === "Admin" ? 5 : 4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-gray-200 dark:text-gray-700" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">No transactions match your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800/60">
        {processedTransactions.length > 0 ? (
          processedTransactions.map((t) => (
            <div key={t.id} className="p-4 hover:bg-purple-50/30 dark:hover:bg-purple-500/5 transition-colors">
              <div className="flex items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center
                    ${t.type === "income"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/20"
                      : "bg-rose-50 dark:bg-rose-500/10 ring-1 ring-rose-200 dark:ring-rose-500/20"}`}>
                    {t.type === "income"
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      : <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{t.category}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(t.date)}</p>
                  </div>
                </div>
                {/* Right */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-sm font-bold tabular-nums
                    ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </span>
                  <TypeBadge type={t.type} />
                </div>
              </div>

              {/* Admin actions */}
              {role === "Admin" && (
                <div className="mt-3">
                  {pendingDeleteId === t.id ? (
                    <DeleteConfirm onConfirm={() => confirmDelete(t.id)} onCancel={() => setPendingDeleteId(null)} />
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setPendingDeleteId(t.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 flex flex-col items-center gap-2">
            <Search className="w-8 h-8 text-gray-200 dark:text-gray-700" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No transactions match your filters</p>
          </div>
        )}
      </div>

      {/* ── Modal (shared for add + edit) ── */}
      {modal && (
        <TransactionModal
          mode={modal}
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TransactionsTable;