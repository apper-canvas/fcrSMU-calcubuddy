import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Info, Trash } from 'lucide-react';
import { fetchCalculationsAsync, deleteCalculationAsync } from '../store/calculationSlice';
import MainFeature from '../components/MainFeature';
import { format } from 'date-fns';

const Home = () => {
  const dispatch = useDispatch();
  const { items: calculations, loading } = useSelector((state) => state.calculations);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    dispatch(fetchCalculationsAsync());
  }, [dispatch]);

  const handleDelete = (calculationId) => {
    dispatch(deleteCalculationAsync(calculationId));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Main Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <MainFeature />
        </motion.div>
        
        {/* History Panel (Slide in from right on mobile, fixed on desktop) */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed md:relative top-0 right-0 h-full md:h-auto w-full md:w-80 bg-white dark:bg-surface-800 shadow-lg md:shadow-none z-10 md:z-0 p-4 md:rounded-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-white">Calculation History</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="md:hidden p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  ✕
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : calculations.length > 0 ? (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
                  {calculations.map(calc => (
                    <div 
                      key={calc.Id}
                      className="p-3 bg-surface-50 dark:bg-surface-700 rounded-xl relative group"
                    >
                      <div className="text-sm text-surface-500 dark:text-surface-400">
                        {calc.expression}
                      </div>
                      <div className="text-lg font-medium">
                        = {calc.result}
                      </div>
                      <div className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                        {calc.timestamp ? format(new Date(calc.timestamp), 'MMM d, yyyy HH:mm') : 'No date'}
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(calc.Id)}
                        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-500 transition-opacity"
                        aria-label="Delete calculation"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-surface-500">
                  <p>No calculations yet</p>
                  <p className="text-sm mt-2">Your calculation history will appear here</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Info Modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">About CalcuBuddy</h2>
                <div className="space-y-3 text-surface-700 dark:text-surface-300">
                  <p>CalcuBuddy is a modern calculator with history tracking and keyboard support.</p>
                  <h3 className="font-medium text-surface-900 dark:text-white">Keyboard Shortcuts:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Numbers: 0-9</li>
                    <li>Operations: +, -, *, /</li>
                    <li>Equals: Enter</li>
                    <li>Clear: Escape</li>
                    <li>Backspace: Delete last character</li>
                  </ul>
                </div>
                <button
                  className="mt-6 w-full py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                  onClick={() => setShowInfo(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(true)}
          className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg"
        >
          <Info size={20} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(!showHistory)}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
        >
          <History size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default Home;