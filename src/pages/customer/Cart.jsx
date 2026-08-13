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
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [paymentMethod, setPaymentMethod] = useState('bKash');

  const distinctStores = new Set(cartItems.map(item => item.sellerId)).size;
  const deliveryFee = distinctStores * 70;
  const discountAmount = cartItems.reduce((sum, item) => {
    const disc = item.discountPercentage || 0;
    return sum + (item.price * item.quantity * disc / 100);
  }, 0);
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

    if (!phoneNumber) {
      alert('Please enter a valid phone number.');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        paymentMethod: paymentMethod,
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/invoice/${data.id}`);
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
            <Link to="/products" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left Side: Items List */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center h-24 shadow-sm hover:shadow-md transition">
                    {/* Product image */}
                    <div className="w-20 h-20 bg-indigo-50 rounded-lg shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-300 text-xs">No img</div>
                      )}
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-center text-xs text-gray-600">
                      <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
                      <div>Quantity: {item.quantity}</div>
                      <div className="font-medium text-indigo-600">৳{item.price.toLocaleString()}</div>
                    </div>

                    <div className="mr-2 flex items-center bg-indigo-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-indigo-200 transition"
                      >
                        <Plus className="w-4 h-4 text-indigo-700" />
                      </button>
                      <span className="mx-3 text-sm font-bold text-indigo-700 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-indigo-200 transition"
                      >
                        <Minus className="w-4 h-4 text-indigo-700" />
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
                  className="w-full bg-indigo-50 text-gray-800 px-4 py-3 rounded-lg border border-indigo-100 outline-none"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Shipping Address"
                  className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm text-gray-700 mb-4">
                  <div className="flex justify-between">
                    <span>Item(s) Total</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({distinctStores} {distinctStores === 1 ? 'store' : 'stores'} × ৳70)</span>
                    <span>৳{deliveryFee.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-৳{Math.round(discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="bg-indigo-50 border border-indigo-100 flex justify-between font-bold text-indigo-900 px-4 py-3 rounded-lg text-sm">
                  <span>Subtotal</span>
                  <span>৳{Math.round(finalTotal).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <p className="text-gray-700 mb-3 text-sm font-medium">Payment Method</p>
                <div className="flex gap-4">
                  {/* bKash */}
                  <button
                    onClick={() => setPaymentMethod('bKash')}
                    className={`w-20 h-12 flex items-center justify-center border rounded-lg transition ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img
                      src="/BKash-Icon-Logo.wine.svg"
                      alt="bKash"
                      className="w-12 h-auto object-contain"
                    />
                  </button>
                  {/* Nagad */}
                  <button
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`w-16 h-12 flex items-center justify-center border rounded-lg transition ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="text-orange-500 font-bold text-xs flex flex-col items-center">
                      <span className="text-lg">🔥</span>
                      <span style={{ fontSize: '8px' }}>নগদ</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-auto flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:cursor-pointer"
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
