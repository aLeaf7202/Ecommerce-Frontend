import { useState, useEffect } from 'react';
import { ChevronLeft, Edit, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';

export default function CustomerProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    try {
      const { data } = await api.put('/auth/profile', {
        name,
        phoneNumber,
        address
      });
      updateUser(data);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', {
        currentPassword,
        password: newPassword
      });
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password.");
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'AWAITING DELIVERY': return { text: 'Awaiting Delivery', bg: 'bg-[#99ccff]', badgeBg: 'bg-[#66b3ff]' };
      case 'COMPLETED': return { text: 'Completed', bg: 'bg-[#99e699]', badgeBg: 'bg-[#4dff4d]' };
      case 'CANCELLED': return { text: 'Canceled', bg: 'bg-[#ff9999]', badgeBg: 'bg-[#ff4d4d]' };
      default: return { text: status, bg: 'bg-gray-200', badgeBg: 'bg-gray-300' };
    }
  };

  if (!user) return null;

  const unavailableItems = orders.flatMap(order => 
    order.OrderItems?.filter(item => item.status === 'UNAVAILABLE').map(item => ({...item, orderId: order.id})) || []
  );

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
                disabled={!isEditing} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`}
              />
              <input 
                type="text" 
                disabled={!isEditing} 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`}
              />
              <input 
                type="email" 
                disabled 
                value={user.email} 
                className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-500 rounded-sm outline-none font-medium"
              />
              <input 
                type="text" 
                disabled={!isEditing} 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`}
              />
            </div>
            
            {isEditing ? (
              <div className="flex gap-4 mt-8 w-full">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-sm font-bold hover:bg-gray-300 transition text-sm hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-sm font-bold hover:bg-indigo-700 transition text-sm hover:cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-8 w-full">
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 bg-indigo-100 text-indigo-600 rounded-sm font-bold hover:bg-indigo-200 transition text-sm hover:cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={logout}
                    className="flex-1 py-2 bg-red-100 text-red-600 rounded-sm font-bold hover:bg-red-200 transition text-sm hover:cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-sm font-bold hover:bg-gray-200 transition text-sm hover:cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Orders */}
          <div className="lg:col-span-8">
            
            {unavailableItems.length > 0 && (
              <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">!</span>
                  Notifications
                </h3>
                <div className="space-y-2">
                  {unavailableItems.map(item => (
                    <div key={item.id} className="text-sm text-red-700 bg-white p-3 rounded border border-red-100 shadow-sm">
                      <span className="font-bold">Order #{item.orderId.slice(0,8)}</span>: The item <strong>{item.Product?.name}</strong> is currently unavailable from the seller. A full refund of ৳{item.price * item.quantity} has been initiated to your original payment method.
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  const isExpanded = expandedOrders[order.id];
                  const totalAmount = order.OrderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.totalPrice;
                  
                  return (
                    <div key={order.id} className={`w-full bg-white border rounded-lg shadow-sm overflow-hidden`}>
                      <div 
                        onClick={() => toggleOrder(order.id)}
                        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition ${statusInfo.bg}`}
                      >
                        <div>
                          <p className="font-bold text-gray-800">Order #{order.id.slice(0,8)}...</p>
                          <p className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm font-semibold mt-1">Total: ৳{totalAmount}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`${statusInfo.badgeBg} text-gray-800 text-xs font-bold px-3 py-1 rounded-sm border border-black/10`}>
                            {statusInfo.text}
                          </div>
                          <span className="text-xs text-indigo-600 font-medium">
                            {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
                          </span>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 bg-gray-50 border-t space-y-3">
                          <h4 className="font-bold text-gray-700 text-sm mb-2">Order Items:</h4>
                          {order.OrderItems?.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="flex items-center gap-4 bg-white p-3 rounded-md border shadow-sm">
                              <div className="w-16 h-16 bg-gray-200 rounded-sm flex-shrink-0 overflow-hidden">
                                {item.Product?.imageUrl && (
                                  <img src={item.Product.imageUrl} alt={item.Product?.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800">{item.Product?.name || 'Unknown Product'}</p>
                                {item.Product?.seller && (
                                  <p className="text-xs text-indigo-600">Seller: {item.Product.seller.storeName || item.Product.seller.name}</p>
                                )}
                                <div className="flex justify-between mt-1 text-sm text-gray-600">
                                  <span>Qty: {item.quantity}</span>
                                  <span className="font-semibold text-gray-800">৳{item.price * item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowSupportModal(true)}
                className="text-sm text-indigo-600 font-medium hover:underline hover:text-indigo-800"
              >
                Need help? Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Contact Support</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Support request submitted!");
              setShowSupportModal(false);
              setIssueType('');
              setIssueDetails('');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Issue</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Order delayed, Wrong item"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Details</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Please describe your issue in detail..."
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}