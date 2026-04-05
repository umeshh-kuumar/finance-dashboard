import React, { useContext } from 'react';
import { Wallet, Shield, Sun, Moon } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { role, setRole, isDarkMode, setIsDarkMode } = useContext(AppContext);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 md:hidden">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              FinanceDash
            </span>
          </div>
          {/* Spacer for md screens where logo is hidden */}
          <div className="hidden md:block"></div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative flex items-center">
              <Shield className="absolute left-3 h-4 w-4 text-purple-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="pl-9 pr-8 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
