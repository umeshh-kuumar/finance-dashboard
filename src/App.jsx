import React, { useContext } from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Layout/Sidebar';
import Insights from './pages/Insights';
import Transaction from './pages/Transaction';
import { AppContext } from './context/AppContext';

function App() {
  const { activePage } = useContext(AppContext);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transaction />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
