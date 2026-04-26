import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    
    try {
      const userData = await login(email, password);
      
      // Basic role-based access control check on frontend
      if (loginType === 'admin' && userData.role === 'CUSTOMER') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      if (loginType === 'customer' && (userData.role === 'ADMIN' || userData.role === 'MANAGER')) {
        // Allow admins to login as customers too? Usually yes, but let's stick to the separation if requested.
        // For now, let's just redirect based on role.
      }

      if (userData.role === 'ADMIN' || userData.role === 'MANAGER') {
        navigate('/admin-dashboard'); // Assuming this route exists or will be created
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 border border-gray-100 shadow-xl">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setLoginType('customer')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                loginType === 'customer' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                loginType === 'admin' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {loginType === 'admin' ? 'Admin Login' : 'Customer Login'}
            </h1>
            <p className="text-gray-600">Sign in to your {loginType} account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>

          {loginType === 'customer' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 shadow-sm hover:shadow-md hover:cursor-pointer flex items-center justify-center gap-2">
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">
                  Create a new one
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}