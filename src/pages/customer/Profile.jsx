import { useState, useEffect } from 'react';
import { ChevronLeft, User as UserIcon, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';

export default function CustomerProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportMsgs, setSupportMsgs] = useState([]);

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
  
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeTicketId, setActiveTicketId] = useState(null);

  const [expandedOrders, setExpandedOrders] = useState({});
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'notifications' | 'support'

  const toggleOrder = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (user && !isEditing) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchData = async () => {
      try {
        const [ordersRes, supportRes, profileRes] = await Promise.all([
          api.get('/orders/myorders'),
          api.get('/support/my'),
          api.get('/auth/profile') // Ensure we get fresh profile details
        ]);
        
        // Update user context with fresh profile data
        if (profileRes.data) {
          updateUser({ ...user, ...profileRes.data });
        }

        setOrders(ordersRes.data);
        setSupportMsgs(supportRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    try {
      const { data } = await api.put('/auth/profile', { name, phoneNumber, address });
      updateUser(data);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', { currentPassword, password: newPassword });
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', { issueType, issueDetails });
      alert("Support request submitted! We'll respond shortly.");
      setShowSupportModal(false);
      setIssueType('');
      setIssueDetails('');
      // Refresh support messages
      const { data } = await api.get('/support/my');
      setSupportMsgs(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send support message.");
    }
  };

  const handleReplySupport = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/support/${activeTicketId}/reply`, { reply: replyText });
      alert("Reply sent successfully.");
      setShowReplyModal(false);
      setReplyText('');
      setActiveTicketId(null);
      const { data } = await api.get('/support/my');
      setSupportMsgs(data);
    } catch (err) {
      alert("Error sending reply");
    }
  };

  const handleMarkOrderItemRead = async (itemId) => {
    try {
      await api.put(`/orders/item/${itemId}/read`);
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSupportMsgRead = async (msgId) => {
    try {
      await api.put(`/support/${msgId}/read`);
      const { data } = await api.get('/support/my');
      setSupportMsgs(data);
    } catch (err) {
      console.error(err);
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
    order.OrderItems?.filter(item => item.status === 'UNAVAILABLE').map(item => ({ ...item, orderId: order.id })) || []
  );
  const notificationMsgs = supportMsgs.filter(m => m.replies && m.replies.length > 0);
  const totalNotifications = unavailableItems.filter(i => !i.customerRead).length + supportMsgs.filter(m => !m.userRead).length;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto p-8">

        {/* Top Navigation */}
        <div className="flex items-center gap-3 mb-12">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-100 transition">
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-2xl font-medium text-gray-800">Customer Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column — Profile Info */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-[#e6e6e6] rounded-full flex items-center justify-center border-[12px] border-black overflow-hidden relative">
                <div className="absolute bottom-[-20px] w-40 h-40 border-[12px] border-black rounded-full"></div>
                <div className="absolute top-[40px] w-24 h-24 border-[12px] border-black rounded-full"></div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <input type="text" disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`} />
              <input type="text" disabled={!isEditing} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number"
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`} />
              <input type="email" disabled value={user.email} className="w-full bg-[#e6e6e6] h-10 px-4 text-center text-gray-500 rounded-sm outline-none font-medium" />
              <input type="text" disabled={!isEditing} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address"
                className={`w-full h-10 px-4 text-center text-gray-800 rounded-sm outline-none font-medium ${!isEditing ? 'bg-[#e6e6e6]' : 'bg-white border border-indigo-300 focus:border-indigo-500'}`} />
            </div>

            {isEditing ? (
              <div className="flex gap-4 mt-8 w-full">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-sm font-bold hover:bg-gray-300 transition text-sm">Cancel</button>
                <button onClick={handleUpdateProfile} className="flex-1 py-2 bg-indigo-600 text-white rounded-sm font-bold hover:bg-indigo-700 transition text-sm">Save</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-8 w-full">
                <div className="flex gap-4 w-full">
                  <button onClick={() => setIsEditing(true)} className="flex-1 py-2 bg-indigo-100 text-indigo-600 rounded-sm font-bold hover:bg-indigo-200 transition text-sm">Edit Profile</button>
                  <button onClick={logout} className="flex-1 py-2 bg-red-100 text-red-600 rounded-sm font-bold hover:bg-red-200 transition text-sm">Log Out</button>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className="w-full py-2 bg-gray-100 text-gray-700 rounded-sm font-bold hover:bg-gray-200 transition text-sm">Change Password</button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">

            {/* Tab Bar */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2 text-sm font-bold rounded-t-md transition ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`relative px-5 py-2 text-sm font-bold rounded-t-md transition ${activeTab === 'notifications' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Notifications
                {totalNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{totalNotifications}</span>
                )}
              </button>
            </div>

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <>
                {loading ? (
                  <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {orders.map((order) => {
                      const statusInfo = getStatusDisplay(order.status);
                      const isExpanded = expandedOrders[order.id];
                      const totalAmount = order.OrderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.totalAmount;
                      return (
                        <div key={order.id} className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
                          <div onClick={() => toggleOrder(order.id)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition ${statusInfo.bg}`}>
                            <div>
                              <p className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}...</p>
                              <p className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                              <p className="text-sm font-semibold mt-1">Total: ৳{totalAmount}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className={`${statusInfo.badgeBg} text-gray-800 text-xs font-bold px-3 py-1 rounded-sm border border-black/10`}>{statusInfo.text}</div>
                              <span className="text-xs text-indigo-600 font-medium">{isExpanded ? 'Hide Details ▲' : 'View Details ▼'}</span>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="p-4 bg-gray-50 border-t space-y-3">
                              <h4 className="font-bold text-gray-700 text-sm mb-2">Order Items:</h4>
                              {order.OrderItems?.map((item, idx) => (
                                <div key={`${order.id}-${idx}`} className="flex items-center gap-4 bg-white p-3 rounded-md border shadow-sm">
                                  <div className="w-16 h-16 bg-gray-200 rounded-sm flex-shrink-0 overflow-hidden">
                                    {item.Product?.imageUrl && <img src={item.Product.imageUrl} alt={item.Product?.name} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-800">{item.Product?.name || 'Unknown Product'}</p>
                                    {item.Product?.seller && <p className="text-xs text-indigo-600">Seller: {item.Product.seller.storeName || item.Product.seller.name}</p>}
                                    <div className="flex justify-between mt-1 text-sm text-gray-600">
                                      <span>Qty: {item.quantity}</span>
                                      <span className="font-semibold text-gray-800">৳{item.price * item.quantity}</span>
                                    </div>
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'UNAVAILABLE' ? 'bg-red-100 text-red-700' : item.status === 'SENT FOR DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {item.status || 'PENDING'}
                                  </span>
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
                  <button onClick={() => setShowSupportModal(true)} className="text-sm text-indigo-600 font-medium hover:underline hover:text-indigo-800">
                    Need help? Contact Support
                  </button>
                </div>
              </>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {unavailableItems.length === 0 && notificationMsgs.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-gray-500">No notifications.</p>
                  </div>
                )}

                {/* Unavailable item alerts */}
                {unavailableItems.map(item => (
                  <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl p-5 cursor-pointer hover:bg-red-100 transition" onClick={() => handleMarkOrderItemRead(item.id)}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">!</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-red-800 text-sm">Item Unavailable — Order #{item.orderId.slice(0, 8)}</p>
                          {!item.customerRead && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">● New</span>}
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          <strong>{item.Product?.name}</strong> is currently unavailable from the seller. A full refund of ৳{(item.price * item.quantity).toLocaleString()} has been initiated to your original payment method.
                        </p>
                        {!item.customerRead && <p className="text-xs text-red-500 mt-2 italic">Click to mark as read</p>}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Unread support messages */}
                {notificationMsgs.map(msg => (
                  <div key={msg.id} className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 cursor-pointer hover:bg-indigo-100 transition" onClick={() => handleMarkSupportMsgRead(msg.id)}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-indigo-900 text-sm">Support Update — {msg.issueType}</p>
                          <div className="flex items-center gap-2">
                            {!msg.userRead && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">● New</span>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.status === 'CLOSED' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>{msg.status}</span>
                          </div>
                        </div>
                        <div className="mt-2 bg-white rounded-lg p-3 border border-indigo-100 text-sm text-gray-700">
                          <p className="text-xs text-gray-400 mb-1">Your message:</p>
                          <p className="text-gray-600 italic">{msg.issueDetails}</p>
                          {msg.replies && msg.replies.map((reply, idx) => (
                            <div key={idx} className="mt-3">
                              <p className="text-xs text-gray-400 mb-1">{reply.senderRole} reply:</p>
                              <p className="text-gray-800 font-medium">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-3 items-center">
                          {msg.status !== 'CLOSED' && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveTicketId(msg.id); setShowReplyModal(true); }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
                              Reply to Admin
                            </button>
                          )}
                          {!msg.userRead && <p className="text-xs text-indigo-400 italic mt-0">Click anywhere to mark as read</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Change Password</button>
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
            <form onSubmit={handleSubmitSupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Issue</label>
                <input type="text" required placeholder="e.g. Order delayed, Wrong item" value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Details</label>
                <textarea required rows={4} placeholder="Please describe your issue in detail..." value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowSupportModal(false)} className="px-4 py-2 bg-gray-200 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reply to Ticket</h3>
            <form onSubmit={handleReplySupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                <textarea required rows={5} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none" placeholder="Write your reply..." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowReplyModal(false); setReplyText(''); setActiveTicketId(null); }} className="px-4 py-2 bg-gray-200 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}