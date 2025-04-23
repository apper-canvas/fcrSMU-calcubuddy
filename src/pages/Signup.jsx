import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { setUser, setLoading, setError } from '../store/userSlice';
import { registerUser } from '../services/apperService';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [useApperUI, setUseApperUI] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (useApperUI) {
      const { ApperUI, ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient("dcb8b96da05e455c94980ac49d8cd8d2");
      
      ApperUI.setup(apperClient, {
        target: '#authentication',
        clientId: "dcb8b96da05e455c94980ac49d8cd8d2", 
        hide: [],
        view: 'signup',
        onSuccess: function(user) {
          dispatch(setUser(user));
          navigate('/');
        },
        onError: function(error) {
          dispatch(setError(error.message || 'Registration failed'));
        }
      });
      
      ApperUI.showSignup("#authentication");
    }
  }, [dispatch, navigate, useApperUI]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    
    try {
      const user = await registerUser(email, password, firstName, lastName);
      dispatch(setUser(user));
      navigate('/');
    } catch (error) {
      dispatch(setError(error.message || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CalcuBuddy
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Create an account to save your calculations
          </p>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg ${useApperUI ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-white'}`}
              onClick={() => setUseApperUI(true)}
            >
              ApperUI
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${!useApperUI ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-white'}`}
              onClick={() => setUseApperUI(false)}
            >
              Custom
            </button>
          </div>

          {useApperUI ? (
            <div id="authentication" className="min-h-[350px] flex items-center justify-center" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:text-white"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:text-white"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary dark:bg-surface-700 dark:text-white"
                  placeholder="Create a password"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;