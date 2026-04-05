import React from 'react';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Dashboard/Charts';
import Piechart from '../components/Dashboard/Piechart';

const Dashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8">
        <section>
          <SummaryCards />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 md:p-8 border border-white/20 dark:border-gray-700/50">
            <Charts />
          </section>
          <section className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(170,59,255,0.05)] p-6 md:p-8 border border-white/20 dark:border-gray-700/50">
            <Piechart />
          </section>
        </div>
        <section>
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
