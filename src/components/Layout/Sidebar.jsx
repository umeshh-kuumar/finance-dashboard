import React, { useContext } from 'react';
import { Home, PieChart, CreditCard, Wallet } from 'lucide-react';
import { AppContext } from '../../context';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'insights', label: 'Insights', icon: PieChart },
];

const Sidebar = () => {
  const { activePage, setActivePage } = useContext(AppContext);
  return (
    <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 hidden md:flex flex-col transition-all duration-300 sticky top-0 h-screen z-20">
      <div className="h-16 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center px-6 gap-3">
        <div className="p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/30">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          FinanceDash
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold w-full text-left transition-all duration-200 
                ${isActive
                  ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              <item.icon className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>)
        })}
      </nav>



    </aside>
  );
};

export default Sidebar;
