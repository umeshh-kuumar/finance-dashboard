import React, { useContext } from 'react';
import { Home, PieChart, CreditCard, Wallet, X } from 'lucide-react';
import { AppContext } from '../../context';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: Home,       description: 'Overview' },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, description: 'History'  },
  { id: 'insights',     label: 'Insights',     icon: PieChart,   description: 'Analytics'},
];

// ── Shared logo block ────────────────────────────────────────────────────────
const Logo = () => (
  <div className="h-16 flex items-center px-5 gap-3 flex-shrink-0">
    <div className="relative">
      <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-md" />
      <div className="relative p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/40">
        <Wallet className="w-4 h-4 text-white" />
      </div>
    </div>
    <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300">
      FinanceDash
    </span>
  </div>
);

// ── Nav item ─────────────────────────────────────────────────────────────────
const NavItem = ({ item, isActive, onClick }) => (
  <button
    onClick={() => onClick(item.id)}
    className={`group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-500
      ${isActive
        ? 'text-white'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-700/50'
      }`}
  >
    {/* Active pill background */}
    {isActive && (
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/40" />
    )}

    {/* Icon */}
    <span className={`relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200
      ${isActive
        ? 'text-white'
        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
      }`}>
      <item.icon className="w-4 h-4" />
    </span>

    {/* Label + description */}
    <span className="relative flex flex-col items-start leading-none">
      <span className="font-semibold text-[13px]">{item.label}</span>
      <span className={`text-[10px] mt-0.5 font-normal transition-colors
        ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
        {item.description}
      </span>
    </span>

    {/* Active dot indicator on the right */}
    {isActive && (
      <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
    )}
  </button>
);

// ── Nav list ─────────────────────────────────────────────────────────────────
const NavList = ({ activePage, onNavClick }) => (
  <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
    {NAV_ITEMS.map((item) => (
      <NavItem
        key={item.id}
        item={item}
        isActive={activePage === item.id}
        onClick={onNavClick}
      />
    ))}
  </nav>
);

// ── Footer section ────────────────────────────────────────────────────────────
const SidebarFooter = () => (
  <div className="px-3 pb-4 flex-shrink-0">
    <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 border border-purple-200/40 dark:border-purple-700/30 p-4">
      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-0.5">Pro Tip</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
        Use Insights to track your monthly saving rate and spot trends.
      </p>
    </div>
  </div>
);

// ── Sidebar inner content (shared between mobile & desktop) ───────────────────
const SidebarContent = ({ activePage, onNavClick, onClose, isMobile }) => (
  <div className="flex flex-col h-full">

    {/* Logo row — close button on mobile */}
    <div className="flex items-center justify-between pr-3 border-b border-gray-200/50 dark:border-gray-700/40 flex-shrink-0">
      <Logo />
      {isMobile && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Section label */}
    <div className="px-4 pt-5 pb-1 flex-shrink-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Menu
      </span>
    </div>

    <NavList activePage={activePage} onNavClick={onNavClick} />

    <SidebarFooter />
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { activePage, setActivePage, isMobileMenuOpen, setIsMobileMenuOpen } = useContext(AppContext);

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsMobileMenuOpen(false);
  };

  const sharedAsideClasses =
    "bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-700/40 flex flex-col";

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-40 md:hidden ${sharedAsideClasses}
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl shadow-black/20' : '-translate-x-full'}`}
      >
        <SidebarContent
          activePage={activePage}
          onNavClick={handleNavClick}
          onClose={() => setIsMobileMenuOpen(false)}
          isMobile
        />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className={`hidden md:flex w-60 flex-col sticky top-0 h-screen z-20 ${sharedAsideClasses}`}>
        <SidebarContent
          activePage={activePage}
          onNavClick={handleNavClick}
          isMobile={false}
        />
      </aside>
    </>
  );
};

export default Sidebar;