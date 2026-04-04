import React from 'react';
import { Wallet } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              FinanceDash
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Placeholder for role toggle to be added in Step 8 */}
            <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
              Welcome back!
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
