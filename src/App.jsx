import React, { useContext, Suspense, lazy } from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import { AppContext } from './context';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Insights = lazy(() => import('./pages/Insights'));
const Transaction = lazy(() => import('./pages/Transaction'));

function App() {
  const { activePage, isMobileMenuOpen, setIsMobileMenuOpen } = useContext(AppContext);

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
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-10" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            {renderPage()}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
