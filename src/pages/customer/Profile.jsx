import { useState, useEffect } from 'react';
import { ChevronLeft, Edit, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return { text: 'Pending Payment', bg: 'bg-[#ffeb99]', badgeBg: 'bg-[#ffd633]' };
      case 'PAID':
      case 'SHIPPED': return { text: 'Awaiting Delivery', bg: 'bg-[#99ccff]', badgeBg: 'bg-[#66b3ff]' };
      case 'DELIVERED': return { text: 'Completed', bg: 'bg-[#99e699]', badgeBg: 'bg-[#4dff4d]' };
      case 'CANCELLED': return { text: 'Canceled', bg: 'bg-[#ff9999]', badgeBg: 'bg-[#ff4d4d]' };
      default: return { text: status, bg: 'bg-gray-200', badgeBg: 'bg-gray-300' };
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Top Navigation */}
        <div className="flex items-center gap-3 mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-2xl font-medium text-gray-800">Customer Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-4 flex flex-col items-center">
            
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-[#e6e6e6] rounded-full flex items-center justify-center border-[12px] border-black overflow-hidden relative">
                {/* Simple user shape representation */}
                <div className="absolute bottom-[-20px] w-40 h-40 border-[12px] border-black rounded-full"></div>
                <div className="absolute top-[40px] w-24 h-24 border-[12px] border-black rounded-full"></div>
              </div>
              <button className="absolute top-4 right-0 bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
                <Edit className="w-5 h-5 text-black" />
              </button>
            </div>
            
            <div className="w-full space-y-3">
              <input 
                type="text" 
                disabled 
                value={user.name} 
                className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium"
              />
              <input 
                type="text" 
                disabled 
                value={user.phoneNumber || 'Phone Number'} 
                className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium"
              />
              <input 
                type="email" 
                disabled 
                value={user.email} 
                className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium"
              />
              <input 
                type="text" 
                disabled 
                value={user.address || 'Address'} 
                className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium"
              />
            </div>
            <button 
              onClick={logout}
              className="mt-8 w-full py-2 bg-red-100 text-red-600 rounded-sm font-bold hover:bg-red-200 transition text-sm"
            >
              Log Out
            </button>
          </div>

          {/* Right Column - Orders */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = getStatusDisplay(order.status);
                  
                  // For the visual mockup, we display one item per block or join them.
                  // Since orders have multiple items, we'll map the items.
                  return order.OrderItems?.map((item, idx) => (
                    <div 
                      key={`${order.id}-${idx}`}
                      className={`w-full ${statusInfo.bg} rounded-md p-2 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-[#a6a6a6] rounded-sm flex-shrink-0 overflow-hidden">
                          {item.Product?.imageUrl && !item.Product.imageUrl.startsWith('http') && item.Product.imageUrl.length > 100 ? (
                            <img src={item.Product.imageUrl} alt={item.Product.name} className="w-full h-full object-cover" />
                          ) : item.Product?.imageUrl && item.Product.imageUrl.startsWith('http') ? (
                            <img src={item.Product.imageUrl} alt={item.Product.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="text-gray-800 text-xs">
                          <p className="font-bold text-sm mb-1">{item.Product?.name || 'Item Name'}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ৳{item.price}</p>
                          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="px-4 py-1 flex items-center justify-center">
                        <div className={`${statusInfo.badgeBg} text-gray-800 text-[10px] px-3 py-1 rounded-sm border border-black/10`}>
                          {statusInfo.text}
                        </div>
                      </div>
                    </div>
                  ));
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}