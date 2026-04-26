import { useEffect } from 'react';
import { FaUser, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto p-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-md"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center border border-gray-200">
              <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg mb-6">
                <FaUser className="w-20 h-20 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
              <p className="text-indigo-600 font-medium mb-6 capitalize">{user.role}</p>
              
              <div className="w-full space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email</p>
                  <p className="text-gray-700 font-medium">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Phone</p>
                  <p className="text-gray-700 font-medium">{user.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-200 text-center w-full h-full flex flex-col items-center justify-center space-y-6">
              <FaChartLine className="w-24 h-24 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-800">Admin Controls</h2>
              <p className="text-gray-500">Manage products, view orders, and handle campaigns from the main dashboard.</p>
              
              <button 
                onClick={() => alert("Dashboard functionality coming soon!")}
                className="mt-6 px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
