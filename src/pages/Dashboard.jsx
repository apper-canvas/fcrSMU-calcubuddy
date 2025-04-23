import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Home from './Home';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-1 bg-surface-50 dark:bg-surface-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">
              Welcome, {user?.firstName || 'User'}!
            </h1>
          </motion.div>
          
          <Home />
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-surface-500 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <p>© {new Date().getFullYear()} CalcuBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;