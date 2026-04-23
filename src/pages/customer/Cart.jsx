import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import api from '../../api/axios';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        paymentMethod: 'bKash' // Placeholder as per requirement
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      alert(`Order placed successfully! Order ID: ${data.id}`);
      navigate('/customerprofile');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            Your Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
              <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
              <Link to="/products" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-200">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-indigo-600 font-bold mt-1">৳{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-lg"><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-lg"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 h-fit border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-xl font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-600/30 transition hover:cursor-pointer"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by bKash</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
