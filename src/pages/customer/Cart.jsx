import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../api/axios';
import { Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const deliveryFee = 130;
  const discountAmount = 130;
  const finalTotal = cartTotal + deliveryFee - discountAmount;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!shippingAddress) {
      alert('Please enter a shipping address.');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        paymentMethod: paymentMethod,
        shippingAddress: shippingAddress // Add this if backend supports it
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      alert(`Order placed successfully! Order ID: ${data.id}`);
      navigate('/customerprofile');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
            <Link to="/products" className="inline-block bg-[#85abff] text-white px-8 py-3 rounded-md font-bold hover:bg-blue-500 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side: Items List */}
            <div>
              <h2 className="text-lg text-gray-800 mb-4">Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[#d9d9d9] rounded-md p-2 flex items-center h-24">
                    {/* Placeholder image from design */}
                    <div className="w-20 h-20 bg-[#c4c4c4] rounded-sm shrink-0 overflow-hidden">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col justify-center text-xs text-gray-800">
                      <div className="font-medium">{item.name}</div>
                      <div>Quantity: {item.quantity}</div>
                      <div>Price: {item.price} BDT</div>
                      <div>Order Date: {new Date().toLocaleDateString()}</div>
                    </div>
                    
                    <div className="mr-4 flex items-center bg-[#c4c4c4] rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-400 transition"
                      >
                        <Plus className="w-4 h-4 text-gray-800" />
                      </button>
                      <span className="mx-3 text-sm font-medium text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleDecrease(item)} 
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-400 transition"
                      >
                        <Minus className="w-4 h-4 text-gray-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Order Info */}
            <div className="flex flex-col">
              {/* Form Fields */}
              <div className="space-y-3 mb-8">
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  readOnly 
                  placeholder="Name" 
                  className="w-full bg-[#e8e8e8] text-gray-800 px-4 py-3 rounded-md outline-none"
                />
                <input 
                  type="text" 
                  value={user?.phoneNumber || ''} 
                  readOnly 
                  placeholder="Phone" 
                  className="w-full bg-[#e8e8e8] text-gray-800 px-4 py-3 rounded-md outline-none"
                />
                <input 
                  type="text" 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Shipping Address" 
                  className="w-full bg-[#e8e8e8] text-gray-800 px-4 py-3 rounded-md outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm text-gray-700 mb-4">
                  <div className="flex justify-between">
                    <span>Item(s) Total</span>
                    <span>{cartTotal} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount Amount</span>
                    <span>{discountAmount} BDT</span>
                  </div>
                </div>
                <div className="bg-[#d9d9d9] flex justify-between font-bold text-gray-900 px-4 py-2 rounded-sm text-sm">
                  <span>Subtotal</span>
                  <span>{finalTotal} BDT</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <p className="text-gray-700 mb-3 text-sm">Payment Method</p>
                <div className="flex gap-4">
                  {/* Cash */}
                  <button 
                    onClick={() => setPaymentMethod('Cash')}
                    className={`w-16 h-12 flex items-center justify-center border rounded-md transition ${paymentMethod === 'Cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                  >
                    <span className="text-green-600 font-bold text-xs flex flex-col items-center">
                      <span>💵</span>
                      <span>Cash</span>
                    </span>
                  </button>
                  {/* bKash (pink bird) */}
                  <button 
                    onClick={() => setPaymentMethod('bKash')}
                    className={`w-16 h-12 flex items-center justify-center border rounded-md transition ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                  >
                    <span className="text-pink-600 font-bold text-xl">b</span>
                  </button>
                  {/* Nagad (orange) */}
                  <button 
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`w-16 h-12 flex items-center justify-center border rounded-md transition ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
                  >
                    <span className="text-orange-500 font-bold text-xs flex flex-col items-center">
                      <span className="text-lg">🔥</span>
                      <span style={{fontSize: '8px'}}>নগদ</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-auto flex justify-end">
                <button 
                  onClick={handleCheckout}
                  className="bg-[#85abff] text-gray-800 px-6 py-2.5 rounded-md font-medium hover:bg-blue-300 transition hover:cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
