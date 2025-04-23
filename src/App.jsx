import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if user is already authenticated
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient("dcb8b96da05e455c94980ac49d8cd8d2");
    
    apperClient.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
      } else if (isAuthenticated) {
        navigate('/login');
      }
    });
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;