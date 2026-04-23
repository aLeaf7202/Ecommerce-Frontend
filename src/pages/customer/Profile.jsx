import { useState, useEffect } from 'react';
import { FaChevronLeft, FaEdit, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 border-yellow-200',
      'SHIPPED': 'bg-blue-100 border-blue-200',
      'DELIVERED': 'bg-green-100 border-green-200',
      'CANCELLED': 'bg-red-100 border-red-200'
    };
    return colors[status] || 'bg-gray-100 border-gray-200';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
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

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-white border rounded-2xl p-6 transition hover:shadow-md ${getStatusColor(order.status).split(' ')[1]}`}
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Order ID: #{order.id}</p>
                        <p className="text-lg font-bold text-gray-800">৳{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="space-y-2 border-t pt-4">
                      {order.OrderItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.Product?.name || 'Product'} x {item.quantity}</span>
                          <span className="font-medium text-gray-800">৳{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}