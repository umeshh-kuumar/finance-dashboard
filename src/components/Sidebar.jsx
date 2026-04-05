import React from 'react';
import { Home, PieChart, CreditCard, Settings, Wallet } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-200 sticky top-0 h-screen">
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 gap-2">
        <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          FinanceDash
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Transactions</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors">
              <PieChart className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">Pro Plan</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">Unlock all features</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
