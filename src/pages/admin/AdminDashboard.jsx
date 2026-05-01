import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  
  // Data States
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const [customersRes, sellersRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/admin/sellers'),
        api.get('/products'),
        api.get('/categories')
      ]);
      setCustomers(customersRes.data);
      setSellers(sellersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
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
                    <div key={seller.id} className="border p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{seller.name}</h3>
                        <p className="text-gray-600 text-sm">{seller.email} • {seller.phoneNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveSeller(seller.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600">Approve</button>
                        <button onClick={() => handleRejectSeller(seller.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600">Reject</button>
                      </div>
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

        </div>
      </div>
    </div>
  );
}
