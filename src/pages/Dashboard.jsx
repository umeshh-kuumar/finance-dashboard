import React from 'react';

const Dashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Grid Layout for the entire dashboard */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Placeholder: Summary Cards (Step 4) */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[120px] flex items-center justify-center text-gray-400">
          Summary Cards Placeholder
        </section>

        {/* Middle Section: Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts (Step 7) */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[300px] flex items-center justify-center text-gray-400">
            Charts Placeholder
          </section>

          {/* Insights (Step 9) */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[300px] flex items-center justify-center text-gray-400">
            Insights Placeholder
          </section>
        </div>

        {/* Bottom Section: Transactions Table (Step 5) */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[400px] flex items-center justify-center text-gray-400">
          Transactions Table Placeholder
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
