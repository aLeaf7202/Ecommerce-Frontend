import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api/axios';
import { Bell, MessageSquare, ExternalLink, Package } from 'lucide-react';
import ViewProduct from '../customer/ViewProduct';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [supportMsgs, setSupportMsgs] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDetails, setIssueDetails] = useState('');

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [editingBlogId, setEditingBlogId] = useState(null);

  const [viewingProduct, setViewingProduct] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, statsRes, blogsRes, supportRes] = await Promise.all([
        api.get('/products/seller/my-products'),
        api.get('/orders/seller/my-orders'),
        api.get('/orders/seller/statistics'),
        api.get('/blogs/my-blogs'),
        api.get('/support/my')
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
      setBlogs(blogsRes.data);
      setSupportMsgs(supportRes.data);
      // Detect low stock products (stock <= 5)
      const lowStock = productsRes.data.filter(p => p.stock !== undefined && p.stock <= 5 && p.stock >= 0);
      setLowStockAlerts(lowStock);
    } catch (error) {
      console.error("Error fetching seller data", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  const handleUpdateItemStatus = async (itemId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/item/${itemId}/status`, { status: newStatus });
      if (data.lowStockAlert) {
        setLowStockAlerts(prev => {
          const exists = prev.find(a => a.id === data.lowStockAlert.productId);
          if (!exists) return [...prev, { id: data.lowStockAlert.productId, name: data.lowStockAlert.productName, stock: data.lowStockAlert.stock }];
          return prev.map(a => a.id === data.lowStockAlert.productId ? { ...a, stock: data.lowStockAlert.stock } : a);
        });
      }
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', { issueType, issueDetails });
      alert('Support request submitted!');
      setShowSupportModal(false);
      setIssueType('');
      setIssueDetails('');
      const { data } = await api.get('/support/my');
      setSupportMsgs(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message.');
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

  const handleMarkLowStockRead = async (productId) => {
    try {
      await api.put(`/products/${productId}/read-low-stock`);
      fetchData(); // refresh to remove it from low stock alerts
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

  // Blog handlers
  const handleBlogImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBlogImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        await api.put(`/blogs/${editingBlogId}`, { title: blogTitle, content: blogContent, imageUrl: blogImage });
        alert("Blog updated!");
      } else {
        await api.post('/blogs', { title: blogTitle, content: blogContent, imageUrl: blogImage });
        alert("Blog created!");
      }
      setBlogTitle('');
      setBlogContent('');
      setBlogImage('');
      setEditingBlogId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving blog");
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content || '');
    setBlogImage(blog.imageUrl || '');
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Delete this blog?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchData();
      } catch (err) {
        alert("Error deleting blog");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogContent('');
    setBlogImage('');
  };

  // PDF Report generation
  const generateReport = () => {
    if (!stats?.report) return;
    const r = stats.report;
    const storeName = user.storeName || user.name;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Sales Report - ${storeName}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
          h1 { color: #4338ca; border-bottom: 3px solid #4338ca; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 10px 14px; text-align: left; }
          th { background: #4338ca; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
          .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
          .summary-card { background: #f0f0ff; padding: 20px; border-radius: 8px; text-align: center; }
          .summary-card h3 { margin: 0; font-size: 28px; color: #4338ca; }
          .summary-card p { margin: 5px 0 0; color: #666; font-size: 14px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>📊 Sales Report — ${storeName}</h1>
        <p><strong>Period:</strong> ${new Date(r.periodStart).toLocaleDateString()} — ${new Date(r.periodEnd).toLocaleDateString()} (Last 28 Days)</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        
        <div class="summary-grid">
          <div class="summary-card">
            <h3>${r.totalSales}</h3>
            <p>Total Sales</p>
          </div>
          <div class="summary-card">
            <h3>৳${r.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
          <div class="summary-card">
            <h3>${r.totalOrdersCompleted}</h3>
            <p>Orders Completed</p>
          </div>
        </div>

        <h2>Product Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Total Ordered</th>
              <th>Total Completed</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${r.productBreakdown.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>৳${p.price}</td>
                <td>${p.totalOrdered}</td>
                <td>${p.totalCompleted}</td>
                <td>৳${p.revenue.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This report was auto-generated by Kenakata Seller Dashboard.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto p-8 w-full flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-indigo-600 text-sm font-medium capitalize">{user.storeName || user.role}</p>
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
              {(lowStockAlerts.filter(p => !p.lowStockNotified).length > 0 || supportMsgs.filter(m => !m.userRead).length > 0) && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{lowStockAlerts.filter(p => !p.lowStockNotified).length + supportMsgs.filter(m => !m.userRead).length}</span>
              )}
            </button>
            {['products', 'orders', 'statistics', 'blogs', 'support'].map(tab => {
              const tabLabels = { products: 'My Products', orders: 'Customer Orders', statistics: 'Statistics', blogs: 'My Blogs', support: 'Support' };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative text-left px-4 py-3 rounded-lg font-medium transition capitalize ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          
          {/* ═══════════ PRODUCTS TAB ═══════════ */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                <Link 
                  to="/seller/create-product"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  + Add Product
                </Link>
              </div>
              
              {products.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
                  <Link to="/seller/create-product" className="text-indigo-600 font-bold hover:underline">
                    Create your first product
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(p => (
                    <div 
                      key={p.id} 
                      className="border border-gray-100 bg-white shadow-sm hover:shadow-md rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center transition cursor-pointer group"
                      onClick={() => setViewingProduct(p)}
                    >
                      <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{p.name}</h3>
                          <span className="text-indigo-600 font-bold text-lg bg-indigo-50 px-3 py-1 rounded-lg">৳{p.price}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded font-medium">{p.category}</span>
                          <span>Stock: <strong className={p.stock <= 5 ? "text-red-500" : "text-green-600"}>{p.stock}</strong></span>
                          {p.discountPercentage > 0 && <span className="text-green-600 font-medium">-{p.discountPercentage}% Off</span>}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
                        
                        <div className="flex items-center gap-3 mt-auto">
                          <Link
                            to={`/seller/edit-product/${p.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}
                            className="text-xs font-bold bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ ORDERS TAB ═══════════ */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500">No orders placed for your products yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const myItems = order.OrderItems?.filter(item => item.Product?.sellerId === user.id) || [];
                    const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                    const customer = order.User;
                    
                    return (
                      <div key={order.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Order #{order.id.slice(0,8)}</p>
                            {customer && (
                              <p className="text-xs text-gray-400">Customer: {customer.name} • {customer.phoneNumber || 'N/A'}</p>
                            )}
                            <p className="text-lg font-bold text-gray-800">Earned: ৳{myTotal.toLocaleString()}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-bold border
                            ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' : 
                              'bg-blue-100 text-blue-700 border-blue-200'}`}
                          >
                            {order.status}
                          </div>
                        </div>
                        <div className="space-y-3 border-t pt-4">
                          {myItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <div>
                                <span className="text-gray-800 font-medium">{item.Product?.name || 'Product'}</span>
                                <span className="text-gray-500 ml-2">x {item.quantity}</span>
                                <p className="font-semibold text-gray-800 mt-1">৳{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <select 
                                  value={item.status || 'PENDING'}
                                  onChange={(e) => handleUpdateItemStatus(item.id, e.target.value)}
                                  disabled={order.status === 'COMPLETED'}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-md outline-none border cursor-pointer
                                    ${item.status === 'UNAVAILABLE' ? 'bg-red-100 text-red-700 border-red-200' : 
                                      item.status === 'SENT FOR DELIVERY' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    } ${order.status === 'COMPLETED' ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="SENT FOR DELIVERY">Sent for Delivery</option>
                                  <option value="UNAVAILABLE">Unavailable</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                          Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ STATISTICS TAB ═══════════ */}
          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Statistics</h2>
              {stats ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{stats.totalProducts}</p>
                      <p className="text-indigo-100 text-sm mt-1">Total Products</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{stats.totalCompletedSales}</p>
                      <p className="text-green-100 text-sm mt-1">Completed Sales</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">৳{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-amber-100 text-sm mt-1">Total Revenue</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md">
                      <p className="text-3xl font-bold">{stats.mostSoldItems?.[0]?.quantity || 0}</p>
                      <p className="text-purple-100 text-sm mt-1">Top Item Sales</p>
                    </div>
                  </div>

                  {/* Most Sold Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Most Sold Items</h3>
                    {stats.mostSoldItems?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b">
                              <th className="pb-3 text-gray-500 text-sm">#</th>
                              <th className="pb-3 text-gray-500 text-sm">Product</th>
                              <th className="pb-3 text-gray-500 text-sm">Qty Sold</th>
                              <th className="pb-3 text-gray-500 text-sm text-right">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.mostSoldItems.map((item, idx) => (
                              <tr key={idx} className="border-b">
                                <td className="py-3 text-gray-400 text-sm">{idx + 1}</td>
                                <td className="py-3 font-medium text-gray-800">{item.name}</td>
                                <td className="py-3 text-gray-600">{item.quantity}</td>
                                <td className="py-3 text-right font-bold text-gray-800">৳{item.revenue.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No sales data yet.</p>
                    )}
                  </div>

                  {/* Generate Report Button */}
                  <button 
                    onClick={generateReport}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md text-sm"
                  >
                    📄 Generate Report (Last 28 Days)
                  </button>
                </>
              ) : (
                <p className="text-gray-500">Loading statistics...</p>
              )}
            </div>
          )}

          {/* ═══════════ BLOGS TAB ═══════════ */}
          {activeTab === 'blogs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingBlogId ? 'Edit Blog' : 'Create Blog'}
              </h2>

              {/* Create/Edit Blog Form */}
              <form onSubmit={handleCreateBlog} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 relative overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleBlogImageUpload} />
                    {blogImage ? (
                      <img src={blogImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">Click to upload cover image</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                  <input 
                    type="text" 
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter blog title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                  <textarea 
                    required
                    rows={6}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write your blog content..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    {editingBlogId ? 'Update Blog' : 'Publish Blog'}
                  </button>
                  {editingBlogId && (
                    <button 
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Existing Blogs */}
              <h3 className="text-lg font-bold text-gray-800 mb-4">My Blogs</h3>
              {blogs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500">You haven't published any blogs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map(blog => (
                    <div key={blog.id} className="border rounded-xl p-4 flex gap-4 items-start hover:shadow-sm transition">
                      {blog.imageUrl && (
                        <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{blog.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{blog.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => handleEditBlog(blog)}
                          className="bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ═══════════ NOTIFICATIONS TAB ═══════════ */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
              {lowStockAlerts.length === 0 && supportMsgs.filter(m => m.replies && m.replies.length > 0).length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Low stock alerts */}
                  {lowStockAlerts.map(p => (
                    <div key={p.id} className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-5 cursor-pointer hover:bg-orange-100 transition" onClick={() => handleMarkLowStockRead(p.id)}>
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">⚠</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-orange-800">Low Stock Alert</p>
                          {!p.lowStockNotified && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">● New</span>}
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          <strong>{p.name}</strong> is running low — only <strong>{p.stock}</strong> unit{p.stock !== 1 ? 's' : ''} left in stock. Consider restocking soon.
                        </p>
                        {!p.lowStockNotified && <p className="text-xs text-orange-500 mt-2 italic">Click to mark as read</p>}
                      </div>
                    </div>
                  ))}
                  {/* Admin replies */}
                  {supportMsgs.filter(m => m.replies && m.replies.length > 0).map(msg => (
                    <div key={msg.id} className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-5 cursor-pointer hover:bg-indigo-100 transition" onClick={() => handleMarkSupportMsgRead(msg.id)}>
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-indigo-900">Support Update — {msg.issueType}</p>
                          <div className="flex items-center gap-2">
                            {!msg.userRead && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">● New</span>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.status === 'CLOSED' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>{msg.status}</span>
                          </div>
                        </div>
                        <div className="mt-2 bg-white rounded-lg p-3 border border-indigo-100 text-sm">
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
                          {!msg.userRead && <p className="text-xs text-indigo-400 italic">Click anywhere to mark as read</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ SUPPORT TAB ═══════════ */}
          {activeTab === 'support' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Contact Support</h2>
                <button onClick={() => setShowSupportModal(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                  + New Request
                </button>
              </div>
              {supportMsgs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500">No support requests submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportMsgs.map(msg => (
                    <div key={msg.id} className="border rounded-xl p-5 bg-white shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{msg.issueType}</p>
                          <p className="text-sm text-gray-600 mt-1">{msg.issueDetails}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          msg.status === 'REPLIED' ? 'bg-green-100 text-green-700' :
                          msg.status === 'CLOSED' ? 'bg-gray-100 text-gray-500' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{msg.status}</span>
                      </div>
                      {msg.replies && msg.replies.length > 0 && (
                        <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100 text-sm">
                          {msg.replies.map((reply, idx) => (
                            <div key={idx} className="mb-2 last:mb-0">
                              <p className="text-xs text-indigo-400 mb-0.5">{reply.senderRole} Reply:</p>
                              <p className="text-indigo-900 font-medium">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3">
                        {msg.status !== 'CLOSED' && (
                          <button onClick={() => { setActiveTicketId(msg.id); setShowReplyModal(true); }} className="text-indigo-600 text-sm font-medium hover:underline">
                            Reply to Admin
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">New Support Request</h3>
            <form onSubmit={handleSubmitSupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                <select required value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select...</option>
                  <option value="ACCOUNT">Account Issue</option>
                  <option value="PAYMENT">Payment/Payout</option>
                  <option value="PRODUCT">Product Listing</option>
                  <option value="ORDER">Order Management</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea required rows={4} value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none" placeholder="Explain your issue..." />
              </div>
              <div className="flex justify-end gap-3">
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
            <h3 className="text-xl font-bold mb-4">Reply to Admin</h3>
            <form onSubmit={handleReplySupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea required rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 border rounded-md resize-none" placeholder="Write your reply..." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowReplyModal(false); setReplyText(''); setActiveTicketId(null); }} className="px-4 py-2 bg-gray-200 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium">Send</button>
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
