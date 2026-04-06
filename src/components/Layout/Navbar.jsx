import React, { useContext } from 'react';
import { Wallet, Shield, ShieldCheck, Sun, Moon, Menu, X } from 'lucide-react';
import { AppContext } from '../../context';

// ── Role badge config ────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  Admin: {
    icon: ShieldCheck,
    label: 'Admin',
    classes: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30 ring-purple-500/20',
    dot: 'bg-purple-500',
  },
  Viewer: {
    icon: Shield,
    label: 'Viewer',
    classes: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 ring-gray-400/20',
    dot: 'bg-gray-400',
  },
};

// ── Icon button ──────────────────────────────────────────────────────────────
const IconButton = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
      hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95
      transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
  >
    {children}
  </button>
);

// ── Dark mode toggle ─────────────────────────────────────────────────────────
const DarkModeToggle = ({ isDarkMode, onToggle }) => (
  <IconButton onClick={onToggle} label="Toggle dark mode">
    <span className="relative block w-5 h-5">
      {/* Sun — visible in dark mode */}
      <Sun
        className={`absolute inset-0 w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
      />
      {/* Moon — visible in light mode */}
      <Moon
        className={`absolute inset-0 w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
      />
    </span>
  </IconButton>
);

// ── Role selector ────────────────────────────────────────────────────────────
const RoleSelector = ({ role, onRoleChange }) => {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.Viewer;
  const Icon = config.icon;

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-xl border text-xs font-semibold
        transition-all duration-200 ring-1 ring-inset cursor-pointer ${config.classes}`}>

        {/* Live dot */}
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} shadow-sm`} />

        <Icon className="w-3.5 h-3.5 flex-shrink-0" />

        <span className="tracking-wide">{config.label}</span>

        {/* Native select overlaid for accessibility */}
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          aria-label="Select role"
        >
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>

        {/* Chevron */}
        <svg className="w-3 h-3 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// ── Logo ─────────────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative">
      <div className="absolute inset-0 bg-purple-500/25 rounded-xl blur-md" />
      <div className="relative p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md shadow-purple-500/30">
        <Wallet className="w-4 h-4 text-white" />
      </div>
    </div>
    <span className="text-base font-bold tracking-tight bg-clip-text text-transparent
      bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300">
      FinanceDash
    </span>
  </div>
);

// ── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700/80 flex-shrink-0" />
);

// ── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const {
    role, setRole,
    isDarkMode, setIsDarkMode,
    isMobileMenuOpen, setIsMobileMenuOpen,
  } = useContext(AppContext);

  return (
    <nav className="sticky top-0 z-10 h-[65px]
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
      border-b border-gray-200/60 dark:border-gray-800/60
      shadow-[0_1px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)]
      transition-colors duration-300">

      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* ── Left: hamburger (mobile) ── */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              label="Toggle menu"
            >
              <span className="relative block w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-200
                  ${isMobileMenuOpen ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`absolute inset-0 w-5 h-5 transition-all duration-200
                  ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`} />
              </span>
            </IconButton>
          </div>

          {/* Logo — always visible on mobile, hidden on md (sidebar shows it) */}
          <div className="md:hidden">
            <Logo />
          </div>
        </div>

        {/* ── Center: breadcrumb / page context (md+) ── */}
        <div className="hidden md:flex flex-1 items-center">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide uppercase">
            Finance Dashboard
          </span>
        </div>

        {/* ── Right: controls ── */}
        <div className="flex items-center gap-2">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          <Divider />
          <RoleSelector role={role} onRoleChange={setRole} />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;