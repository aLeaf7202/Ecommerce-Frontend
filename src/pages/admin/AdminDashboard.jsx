import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { Package } from 'lucide-react';
import api from '../../api/axios';
import ViewProduct from '../customer/ViewProduct';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [expandedSellerId, setExpandedSellerId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Data States
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supportMsgs, setSupportMsgs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  // Support reply state
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

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
      const [customersRes, sellersRes, productsRes, categoriesRes, ordersRes, supportRes, statsRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/admin/sellers'),
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/support'),
        api.get('/admin/statistics'),
      ]);
      setCustomers(customersRes.data);
      setSellers(sellersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data || []);
      setSupportMsgs(supportRes.data || []);
      setAdminStats(statsRes.data || null);
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

  // Opens a printable HTML report of a pending seller's submitted details
  // (including the embedded NID and business license images) in a new tab.
  // The admin can then save it as a PDF via the browser print dialog.
  const handleDownloadSellerDetails = (seller) => {
    const escape = (value) => {
      if (value === null || value === undefined || value === '') return '—';
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };
    const imgOrPlaceholder = (src, label) =>
      src
        ? `<img src="${src}" alt="${escape(label)}" />`
        : `<div class="placeholder">Not provided</div>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download seller details.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Seller Application — ${escape(seller.storeName || seller.name)}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1f2937; max-width: 900px; margin: 0 auto; }
          h1 { color: #4338ca; border-bottom: 3px solid #4338ca; padding-bottom: 10px; margin-bottom: 8px; }
          .meta { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
          h2 { color: #374151; margin-top: 28px; font-size: 18px; }
          dl { display: grid; grid-template-columns: 200px 1fr; gap: 8px 16px; margin: 0 0 16px; }
          dt { color: #6b7280; font-weight: 600; }
          dd { margin: 0; color: #111827; word-break: break-word; }
          .desc { background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 14px; border-radius: 8px; }
          .docs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }
          .doc { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #fff; }
          .doc h3 { font-size: 14px; margin: 0 0 8px; color: #374151; }
          .doc img { width: 100%; height: auto; border-radius: 4px; display: block; }
          .placeholder { height: 200px; display: flex; align-items: center; justify-content: center; color: #9ca3af; background: #f3f4f6; border-radius: 4px; font-size: 13px; }
          .status { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: #fef3c7; color: #92400e; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center; }
          @media print { body { padding: 24px; } .docs { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>Seller Application</h1>
        <div class="meta">
          <span class="status">${escape(seller.status || 'PENDING')}</span>
          &nbsp;•&nbsp; Generated ${new Date().toLocaleString()}
        </div>

        <h2>Account</h2>
        <dl>
          <dt>Manager Name</dt><dd>${escape(seller.name)}</dd>
          <dt>Email</dt><dd>${escape(seller.email)}</dd>
          <dt>Phone</dt><dd>${escape(seller.phoneNumber)}</dd>
          <dt>Account ID</dt><dd>${escape(seller.id)}</dd>
          <dt>Submitted</dt><dd>${seller.createdAt ? new Date(seller.createdAt).toLocaleString() : '—'}</dd>
        </dl>

        <h2>Store</h2>
        <dl>
          <dt>Store Name</dt><dd>${escape(seller.storeName)}</dd>
          <dt>Address</dt><dd>${escape(seller.address)}</dd>
        </dl>
        <p style="margin: 6px 0;"><strong>Store Description</strong></p>
        <div class="desc">${escape(seller.storeDescription || 'No description provided.')}</div>

        <h2>Submitted Documents</h2>
        <div class="docs">
          <div class="doc">
            <h3>National ID (NID)</h3>
            ${imgOrPlaceholder(seller.nidImage, 'NID')}
          </div>
          <div class="doc">
            <h3>Business License</h3>
            ${imgOrPlaceholder(seller.businessLicenseImage, 'Business License')}
          </div>
        </div>

        <div class="footer">
          Confidential — Kenakata Admin. For internal review only.
        </div>

        <script>
          window.addEventListener('load', () => {
            setTimeout(() => window.print(), 300);
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
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

  const handleReplySupport = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/support/${replyingToId}/reply`, { reply: replyText });
      setReplyingToId(null);
      setReplyText('');
      fetchData();
    } catch (err) {
      alert("Error sending reply");
    }
  };

  const handleCloseTicket = async (id) => {
    try {
      await api.put(`/support/${id}/close`);
      fetchData();
    } catch (err) {
      alert("Error closing ticket");
    }
  };

  const handleMarkSupportMsgRead = async (msgId) => {
    try {
      await api.put(`/support/${msgId}/read`);
      const { data } = await api.get('/support');
      setSupportMsgs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateAdminReport = () => {
    if (!adminStats?.report) return;
    const r = adminStats.report;
    const t = adminStats.totals;
    const ratePct = Math.round((adminStats.commissionRate ?? 0.05) * 100);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Admin Platform Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
        h1 { color: #4338ca; border-bottom: 3px solid #4338ca; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 10px 14px; text-align: left; }
        th { background: #4338ca; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin: 20px 0; }
        .card { background: #f0f0ff; padding: 20px; border-radius: 8px; text-align: center; }
        .card h3 { margin: 0; font-size: 26px; color: #4338ca; }
        .card p { margin: 4px 0 0; color: #666; font-size: 13px; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <h1>📊 Platform Report — Kenakata Admin</h1>
        <p><strong>Period:</strong> ${new Date(r.periodStart).toLocaleDateString()} — ${new Date(r.periodEnd).toLocaleDateString()} (Last 28 Days)</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><em>Platform revenue is the ${ratePct}% commission collected from each completed sale. Sellers receive the remaining ${100 - ratePct}%.</em></p>
        <h2>Platform Totals</h2>
        <div class="grid">
          <div class="card"><h3>${t.customers}</h3><p>Total Customers</p></div>
          <div class="card"><h3>${t.sellers}</h3><p>Total Sellers</p></div>
          <div class="card"><h3>${t.products}</h3><p>Total Products</p></div>
          <div class="card"><h3>৳${Math.round(t.grossSales ?? 0).toLocaleString()}</h3><p>Gross Marketplace Sales</p></div>
          <div class="card"><h3>৳${Math.round(t.revenue).toLocaleString()}</h3><p>Platform Revenue (${ratePct}%)</p></div>
        </div>
        <h2>Last 28 Days Activity</h2>
        <div class="grid">
          <div class="card"><h3>${r.totalOrders}</h3><p>Total Orders</p></div>
          <div class="card"><h3>${r.completedOrders}</h3><p>Completed</p></div>
          <div class="card"><h3>${r.cancelledOrders}</h3><p>Cancelled</p></div>
          <div class="card"><h3>৳${Math.round(r.grossSales ?? 0).toLocaleString()}</h3><p>Gross Sales</p></div>
          <div class="card"><h3>৳${Math.round(r.totalRevenue).toLocaleString()}</h3><p>Platform Revenue (${ratePct}%)</p></div>
        </div>
        <h2>Top Products (by Gross Revenue)</h2>
        <table>
          <thead><tr><th>#</th><th>Product</th><th>Units Sold</th><th>Gross</th><th>Platform (${ratePct}%)</th></tr></thead>
          <tbody>${r.topProducts.map((p, i) => `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.quantity}</td><td>৳${Math.round(p.revenue).toLocaleString()}</td><td>৳${Math.round(p.commission ?? p.revenue * 0.05).toLocaleString()}</td></tr>`).join('')}</tbody>
        </table>
        <div class="footer"><p>Auto-generated by Kenakata Admin Dashboard.</p></div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <button onClick={() => setActiveTab('notifications')} className={`text-left px-4 py-3 rounded-lg font-medium transition flex justify-between items-center ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              Notifications
              {pendingSellers.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingSellers.length}</span>}
            </button>
            <button onClick={() => setActiveTab('support')} className={`text-left px-4 py-3 rounded-lg font-medium transition flex justify-between items-center ${activeTab === 'support' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              Support Tickets
              {supportMsgs.filter(m => !m.adminRead).length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{supportMsgs.filter(m => !m.adminRead).length}</span>
              )}
            </button>
            <button onClick={() => setActiveTab('statistics')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'statistics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Statistics</button>
            <button onClick={() => setActiveTab('categories')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'categories' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Categories</button>
            <button onClick={() => setActiveTab('customers')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'customers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Customers</button>
            <button onClick={() => setActiveTab('sellers')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'sellers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Sellers</button>
            <button onClick={() => setActiveTab('products')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Products</button>
            <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Orders</button>
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
                            onClick={(e) => { e.stopPropagation(); handleDownloadSellerDetails(seller); }}
                            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition"
                          >
                            Download
                          </button>
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
              {products.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-gray-500 text-sm">Product</th>
                        <th className="pb-3 text-gray-500 text-sm">Category</th>
                        <th className="pb-3 text-gray-500 text-sm">Seller</th>
                        <th className="pb-3 text-gray-500 text-sm text-right">Price</th>
                        <th className="pb-3 text-gray-500 text-sm text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr
                          key={p.id}
                          onClick={() => setViewingProduct(p)}
                          className="border-b hover:bg-gray-50 cursor-pointer transition"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <p className="font-medium text-gray-800 truncate max-w-xs">{p.name}</p>
                            </div>
                          </td>
                          <td className="py-3 text-gray-600">{p.category}</td>
                          <td className="py-3 text-gray-600">
                            {p.seller ? (p.seller.storeName || p.seller.name) : <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="py-3 text-right font-bold text-gray-800">৳{p.price?.toLocaleString?.() ?? p.price}</td>
                          <td className={`py-3 text-right font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                            {p.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
              <div className="space-y-4">
                {orders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const customer = order.User;
                  return (
                    <div key={order.id} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                      <div 
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div>
                          <h3 className="font-bold text-gray-800">Order #{order.id.slice(0,8)}</h3>
                          {customer && <p className="text-xs text-gray-500">Customer: {customer.name} • {customer.email}</p>}
                          <p className="text-gray-600 text-sm font-semibold">Total: ৳{order.totalAmount}</p>
                          <p className="text-gray-400 text-xs">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <select 
                            value={order.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`border rounded px-3 py-1.5 text-xs font-bold outline-none cursor-pointer
                              ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' : 
                                'bg-blue-100 text-blue-700 border-blue-200'}`}
                          >
                            <option value="AWAITING DELIVERY">Awaiting Delivery</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <span className="text-xs text-indigo-600 font-medium">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      
                      {isExpanded && order.OrderItems && (
                        <div className="p-4 bg-gray-50 border-t space-y-3">
                          <h4 className="font-bold text-gray-700 text-sm">Order Items:</h4>
                          {order.OrderItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                              <div>
                                <p className="font-bold text-sm text-gray-800">{item.Product?.name || 'Unknown'}</p>
                                {item.Product?.seller && (
                                  <p className="text-xs text-indigo-600">Seller: {item.Product.seller.storeName || item.Product.seller.name}</p>
                                )}
                                <p className="text-sm text-gray-600">Qty: {item.quantity} • ৳{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-md border
                                ${item.status === 'UNAVAILABLE' ? 'bg-red-100 text-red-700 border-red-200' : 
                                  item.status === 'SENT FOR DELIVERY' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                  'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                              >
                                {item.status || 'PENDING'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
              </div>
            </div>
          )}

          {/* ═══════════ STATISTICS TAB ═══════════ */}
          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Statistics</h2>
              {adminStats ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{adminStats.totals.customers}</p>
                      <p className="text-indigo-100 text-sm mt-1">Total Customers</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{adminStats.totals.sellers}</p>
                      <p className="text-emerald-100 text-sm mt-1">Total Sellers</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{adminStats.totals.products}</p>
                      <p className="text-violet-100 text-sm mt-1">Total Products</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-600 to-slate-700 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">৳{Math.round(adminStats.totals.grossSales ?? 0).toLocaleString()}</p>
                      <p className="text-slate-200 text-sm mt-1">Gross Marketplace Sales</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">৳{Math.round(adminStats.totals.revenue).toLocaleString()}</p>
                      <p className="text-amber-100 text-sm mt-1">Platform Revenue ({Math.round((adminStats.commissionRate ?? 0.05) * 100)}% of sales)</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{adminStats.totals.orders}</p>
                      <p className="text-blue-100 text-sm mt-1">Total Orders</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products (All-Time)</h3>
                  {adminStats.report.topProducts.length > 0 ? (
                    <div className="overflow-x-auto mb-8">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-3 text-gray-500 text-sm">#</th>
                            <th className="pb-3 text-gray-500 text-sm">Product</th>
                            <th className="pb-3 text-gray-500 text-sm">Units Sold</th>
                            <th className="pb-3 text-gray-500 text-sm text-right">Gross</th>
                            <th className="pb-3 text-gray-500 text-sm text-right">Platform ({Math.round((adminStats.commissionRate ?? 0.05) * 100)}%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminStats.report.topProducts.map((p, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-3 text-gray-400 text-sm">{idx + 1}</td>
                              <td className="py-3 font-medium text-gray-800">{p.name}</td>
                              <td className="py-3 text-gray-600">{p.quantity}</td>
                              <td className="py-3 text-right text-gray-500">৳{Math.round(p.revenue).toLocaleString()}</td>
                              <td className="py-3 text-right font-bold text-gray-800">৳{Math.round(p.commission ?? p.revenue * 0.05).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-8">No sales data yet.</p>
                  )}

                  <button onClick={generateAdminReport} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md text-sm">
                    📄 Generate Platform Report (Last 28 Days)
                  </button>
                </>
              ) : (
                <p className="text-gray-500">Loading statistics...</p>
              )}
            </div>
          )}

          {/* ═══════════ SUPPORT TICKETS TAB ═══════════ */}
          {activeTab === 'support' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Tickets</h2>
              {supportMsgs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500">No support messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportMsgs.map(msg => (
                    <div key={msg.id} className="border rounded-xl p-5 bg-white shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => handleMarkSupportMsgRead(msg.id)}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${msg.fromRole === 'SELLER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {msg.fromRole}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${msg.status === 'REPLIED' ? 'bg-green-100 text-green-700' : msg.status === 'CLOSED' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-700'}`}>
                              {msg.status}
                            </span>
                            {!msg.adminRead && <span className="text-xs font-bold text-red-500">● New Message</span>}
                          </div>
                          <p className="font-bold text-gray-800">{msg.sender?.name} <span className="text-gray-400 font-normal text-sm">({msg.sender?.email})</span></p>
                          <p className="text-indigo-600 font-semibold text-sm mt-1">{msg.issueType}</p>
                          <p className="text-sm text-gray-600 mt-1">{msg.issueDetails}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                          
                          {msg.replies && msg.replies.length > 0 && (
                            <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              {msg.replies.map((reply, idx) => (
                                <div key={idx} className="mb-2 last:mb-0">
                                  <p className={`text-xs font-bold mb-0.5 ${reply.senderRole === 'ADMIN' ? 'text-green-600' : 'text-blue-600'}`}>{reply.senderRole} ({reply.senderName}):</p>
                                  <p className="text-sm text-gray-800">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {msg.status !== 'CLOSED' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setReplyingToId(msg.id); }} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 transition">
                                Reply
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleCloseTicket(msg.id); }} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition">Close</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Reply Modal */}
      {replyingToId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reply to Support Ticket</h3>
            <form onSubmit={handleReplySupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                <textarea required rows={5} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none" placeholder="Write your reply..." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setReplyingToId(null); setReplyText(''); }} className="px-4 py-2 bg-gray-200 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <ViewProduct product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}
    </div>
  );
}
