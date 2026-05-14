import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [expandedSellerId, setExpandedSellerId] = useState(null);
  
  // Data States
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [customersRes, sellersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/admin/sellers'),
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders') // I will create this route if missing or assume it exists/use all orders
      ]);
      setCustomers(customersRes.data);
      setSellers(sellersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const pendingSellers = sellers.filter(s => s.status === 'PENDING');

  const handleApproveSeller = async (id) => {
    try {
      await api.put(`/admin/sellers/${id}/status`, { status: 'APPROVED' });
      fetchData();
    } catch (err) {
      alert("Error approving seller");
    }
  };

  const handleRejectSeller = async (id) => {
    try {
      await api.put(`/admin/sellers/${id}/status`, { status: 'REJECTED' });
      fetchData();
    } catch (err) {
      alert("Error rejecting seller");
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchData();
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if(!newCategory) return;
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if(window.confirm("Delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (err) {
        alert("Error deleting category");
      }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert("Error updating order status");
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto p-8 w-full flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-indigo-600 text-sm font-medium capitalize">{user.role}</p>
            <button 
              onClick={logout}
              className="mt-4 w-full py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition text-sm"
            >
              Log Out
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition flex justify-between items-center ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Notifications
              {pendingSellers.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingSellers.length}</span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'categories' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'customers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Customers
            </button>
            <button 
              onClick={() => setActiveTab('sellers')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'sellers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Sellers
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h2>
              {pendingSellers.length === 0 ? (
                <p className="text-gray-500">No pending seller registrations.</p>
              ) : (
                <div className="space-y-4">
                  {pendingSellers.map(seller => (
                    <div key={seller.id} className="border p-4 rounded-xl flex flex-col">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedSellerId(expandedSellerId === seller.id ? null : seller.id)}
                      >
                        <div>
                          <h3 className="font-bold text-lg hover:text-indigo-600 transition">{seller.name} <span className="text-sm font-normal text-gray-500">(Store: {seller.storeName})</span></h3>
                          <p className="text-gray-600 text-sm">{seller.email} • {seller.phoneNumber}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleApproveSeller(seller.id); }} 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRejectSeller(seller.id); }} 
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      
                      {expandedSellerId === seller.id && (
                        <div className="mt-6 pt-6 border-t space-y-4">
                          <div>
                            <p className="font-semibold text-gray-700">Store Address:</p>
                            <p className="text-gray-600 text-sm">{seller.address || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Store Description:</p>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{seller.storeDescription || 'No description provided.'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">NID Document:</p>
                              <div className="border rounded-md overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                                {seller.nidImage ? (
                                  <img src={seller.nidImage} alt="NID" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-gray-400 text-sm">Not provided</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">Business License:</p>
                              <div className="border rounded-md overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                                {seller.businessLicenseImage ? (
                                  <img src={seller.businessLicenseImage} alt="Business License" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-gray-400 text-sm">Not provided</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h2>
              <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="New Category Name" 
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Add Category</button>
              </form>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-gray-50 border p-4 rounded-xl flex justify-between items-center">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-gray-500">Name</th>
                      <th className="pb-3 text-gray-500">Email</th>
                      <th className="pb-3 text-gray-500">Phone</th>
                      <th className="pb-3 text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id} className="border-b">
                        <td className="py-4 font-medium">{c.name}</td>
                        <td className="py-4 text-gray-600">{c.email}</td>
                        <td className="py-4 text-gray-600">{c.phoneNumber}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteUser(c.id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sellers' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sellers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-gray-500">Name</th>
                      <th className="pb-3 text-gray-500">Email</th>
                      <th className="pb-3 text-gray-500">Status</th>
                      <th className="pb-3 text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.filter(s => s.status !== 'PENDING').map(s => (
                      <tr key={s.id} className="border-b">
                        <td className="py-4 font-medium">{s.name}</td>
                        <td className="py-4 text-gray-600">{s.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteUser(s.id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="border rounded-xl p-4 flex flex-col">
                    <div className="h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                    <p className="text-indigo-600 font-bold mt-auto">৳{p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm">
                    <div>
                      <h3 className="font-bold">Order #{order.id.slice(0,8)}</h3>
                      <p className="text-gray-600 text-sm">Total: ৳{order.totalAmount}</p>
                      <p className="text-gray-500 text-xs">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status}
                      </span>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
                      >
                        <option value="AWAITING DELIVERY">Awaiting Delivery</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
