import React from 'react';
import SummaryCards from '../components/SummaryCards';
import TransactionsTable from '../components/TransactionsTable';
import Charts from '../components/Charts';
import Insights from '../components/Insights';

const Dashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Grid Layout for the entire dashboard */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Step 4: Summary Cards */}
        <section>
          <SummaryCards />
        </section>

        {/* Middle Section: Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts (Step 7) */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <Charts />
          </section>

          {/* Insights (Step 9) */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <Insights />
          </section>
        </div>

        {/* Bottom Section: Transactions Table (Step 5) */}
        <section>
          <TransactionsTable />
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
