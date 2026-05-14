import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api/axios';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/seller/my-products'),
        api.get('/orders/seller/my-orders')
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
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
      await api.put(`/orders/item/${itemId}/status`, { status: newStatus });
      fetchData(); // Refresh to show new status
    } catch (err) {
      alert("Error updating status");
    }
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
              onClick={() => setActiveTab('products')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              My Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Customer Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="border rounded-xl p-4 flex flex-col relative group">
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/seller/edit-product/${p.id}`}
                          className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-indigo-600 transition"
                        >
                          ✎
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      </div>
                      <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <h3 className="font-bold text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                      <p className="text-indigo-600 font-bold mt-auto">৳{p.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                    // Filter order items to only show the ones belonging to this seller
                    const myItems = order.OrderItems.filter(item => item.Product.sellerId === user.id);
                    const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                    
                    return (
                      <div key={order.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Order ID: #{order.id}</p>
                            <p className="text-lg font-bold text-gray-800">Earned: ৳{myTotal.toLocaleString()}</p>
                          </div>
                          <div className="px-4 py-1.5 rounded-full text-xs font-bold border bg-gray-100 text-gray-700">
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
                                  className={`text-xs font-bold px-3 py-1.5 rounded-md outline-none border cursor-pointer
                                    ${item.status === 'UNAVAILABLE' ? 'bg-red-100 text-red-700 border-red-200' : 
                                      item.status === 'SENT FOR DELIVERY' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}
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

        </div>
      </div>
    </div>
  );
}
