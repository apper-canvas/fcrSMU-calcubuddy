import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { clearUser } from '../store/userSlice';
import { clearCalculations } from '../store/calculationSlice';
import { logoutUser } from '../services/apperService';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      dispatch(clearCalculations());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CalcuBuddy
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-primary" />
          )}
        </motion.button>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              {user?.firstName ? user.firstName[0] : <User size={16} />}
            </div>
            <span className="hidden md:block text-surface-800 dark:text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
            </span>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-700 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-600">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{user?.emailAddress}</p>
              </div>
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface-100 dark:hover:bg-surface-600"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;